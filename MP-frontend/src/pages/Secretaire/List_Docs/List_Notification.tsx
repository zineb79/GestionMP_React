import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Input,
  FloatButton,
  Form,
  DatePicker,
  Select,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  deleteNotification,
  updateNotification,
  getNotificationsByMarche,
} from "../../../services/NotificationService";
import { getMarches } from "../../../services/MarcheService";
import { getSocietes } from "../../../services/SocieteService";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import "../PagesSec.css";
import dayjs from "dayjs";
import { Notification } from "../../../services/NotificationService";
import { Marche } from "../../../services/MarcheService";
import { Societe } from "../../../services/SocieteService";
import { DocumentService } from "../../../services/DocumentService";

const List_Notification = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);
  const [dataSource, setDataSource] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [marches, setMarches] = useState<Marche[]>([]);
  const [societes, setSocietes] = useState<Societe[]>([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [notificationsData, marchesData, societesData] =
          await Promise.all([getNotifications(), getMarches(), getSocietes()]);

        // Associer les marchés et sociétés aux notifications
        const enrichedData = notificationsData.map((notif) => {
          const marche = marchesData.find(
            (m) => m.id_Marche === notif.marche_NOTIF
          );
          const societe = societesData.find(
            (s) => s.id_SO === Number(notif.societe_NOTIF)
          );
          return {
            ...notif,
            marche_NOTIF_obj: marche,
            marche_NOTIF: marche?.id_Marche || notif.marche_NOTIF,
            societe_NOTIF_obj: societe,
            societe_NOTIF: societe?.id_SO || notif.societe_NOTIF,
          } as Notification;
        });

        setDataSource(enrichedData);
        setMarches(marchesData);
        setSocietes(societesData);
        console.log("Notifications chargées:", enrichedData);
        console.log("Marchés chargés:", marchesData);
        console.log("Sociétés chargées:", societesData);
        console.log("Données enrichies:", enrichedData);
        console.log(
          "Marchés IDs:",
          marchesData.map((m) => m.id_Marche)
        );
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        message.error("Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onDeleteNotification = async (record: Notification) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer cette notification ?",
      okText: "Oui",
      okType: "danger",
      onOk: async () => {
        if (!record.id_NOTIF) return;
        try {
          await deleteNotification(record.id_NOTIF);
          setDataSource((prev) =>
            prev.filter((not) => not.id_NOTIF !== record.id_NOTIF)
          );
          message.success("Notification supprimée avec succès");
        } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          message.error("Échec de la suppression de la notification");
        }
      },
    });
  };

  const onEditNotification = (record: Notification) => {
    setIsEditing(true);
    setEditingNotification({ ...record });
    form.setFieldsValue({
      ...record,
      dateVisa_NOTIF: record.dateVisa_NOTIF
        ? dayjs(record.dateVisa_NOTIF)
        : null,
      dateApprobation_NOTIF: record.dateApprobation_NOTIF
        ? dayjs(record.dateApprobation_NOTIF)
        : null,
    });
  };

  const handleSave = async (values: any) => {
    if (!editingNotification || !editingNotification.id_NOTIF) {
      message.error("ID de la notification manquant");
      return;
    }
    try {
      const updatedNotification = {
        ...editingNotification,
        ...values,
        dateVisa_NOTIF: values.dateVisa_NOTIF?.format("YYYY-MM-DD"),
        dateApprobation_NOTIF:
          values.dateApprobation_NOTIF?.format("YYYY-MM-DD"),
        marche_NOTIF: values.marche_NOTIF,
        societe_NOTIF: values.societe_NOTIF,
      } as Notification;

      const response = await updateNotification(
        editingNotification.id_NOTIF,
        updatedNotification
      );

      const newData = await getNotifications();
      const enrichedData = newData.map((notif) => {
        const marche = marches.find((m) => m.id_Marche === notif.marche_NOTIF);
        const societe = societes.find(
          (s) => s.id_SO === Number(notif.societe_NOTIF)
        );
        return {
          ...notif,
          marche_NOTIF_obj: marche,
          marche_NOTIF: marche?.id_Marche || notif.marche_NOTIF,
          societe_NOTIF_obj: societe,
          societe_NOTIF: societe?.id_SO || notif.societe_NOTIF,
        } as Notification;
      });
      setDataSource(enrichedData);

      setEditingNotification(null);
      setIsEditing(false);
      console.log("Données enrichies:", updatedNotification);
      message.success("Notification mise à jour avec succès");
      resetEditing();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      message.error("Échec de la mise à jour de la notification");
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingNotification(null);
    form.resetFields();
  };
  const generateDocument = async (notification: Notification) => {
    try {
      await DocumentService.generateNotificationDocument(notification);
      message.success("Document généré avec succès");
    } catch (error) {
      message.error("Erreur lors de la génération du document");
    }
  };
  const columns = [
    {
      title: "Numéro de Marché",
      key: "marche_NOTIF",
      render: (record: Notification) =>
        record.marche_NOTIF_obj?.numOrdre || "N/A",
      sorter: (a: Notification, b: Notification) =>
        (a.marche_NOTIF_obj?.numOrdre || "").localeCompare(
          b.marche_NOTIF_obj?.numOrdre || ""
        ),
    },
    {
      title: "Société",
      key: "societe_NOTIF",
      render: (record: Notification) =>
        record.societe_NOTIF_obj?.raisonSociale || "N/A",
      sorter: (a: Notification, b: Notification) =>
        (a.societe_NOTIF_obj?.raisonSociale || "").localeCompare(
          b.societe_NOTIF_obj?.raisonSociale || ""
        ),
    },
    {
      title: "Numéro de Notification",
      dataIndex: "numOrdre_NOTIF",
      key: "numOrdre_NOTIF",
      sorter: (a: Notification, b: Notification) =>
        a.numOrdre_NOTIF.localeCompare(b.numOrdre_NOTIF),
    },
    {
      title: "Date de Visa",
      dataIndex: "dateVisa_NOTIF",
      key: "dateVisa_NOTIF",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : "N/A",
      sorter: (a: Notification, b: Notification) =>
        new Date(a.dateVisa_NOTIF).getTime() -
        new Date(b.dateVisa_NOTIF).getTime(),
    },
    {
      title: "Date d'Approbation",
      dataIndex: "dateApprobation_NOTIF",
      key: "dateApprobation_NOTIF",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : "N/A",
      sorter: (a: Notification, b: Notification) =>
        new Date(a.dateApprobation_NOTIF).getTime() -
        new Date(b.dateApprobation_NOTIF).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Notification) => (
        <>
          <EditOutlined
            onClick={() => onEditNotification(record)}
            style={{ color: "#1890ff", cursor: "pointer" }}
          />
          {/*
          <DeleteOutlined
            onClick={() => onDeleteNotification(record)}
            style={{ color: "red", marginLeft: 12, cursor: "pointer" }}
          />
          */}
          <FileWordOutlined
            onClick={() => generateDocument(record)}
            style={{ color: "purple", marginLeft: 14 }}
          />
        </>
      ),
    },
  ];

  return (
    <Sidebar>
      <div className="list-container">
        <FloatButton
          icon={<PlusOutlined />}
          onClick={() => navigate("/AddNotification")}
          tooltip="Ajouter une notification"
        />
        <div className="list-header">
          <h2 className="list-title">Liste des Notifications</h2>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id_NOTIF"
          loading={loading}
          bordered
        />
        <Modal
          title="Modifier la notification"
          open={isEditing}
          onCancel={resetEditing}
          onOk={() => form.submit()}
          width={600}
          destroyOnClose
        >
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item name="numOrdre_NOTIF" label="Numéro de notification">
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="marche_NOTIF"
              label="Marché"
              rules={[
                { required: true, message: "Veuillez sélectionner un marché" },
              ]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="societe_NOTIF"
              label="Société"
              rules={[
                {
                  required: true,
                  message: "Veuillez sélectionner une société",
                },
              ]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="dateVisa_NOTIF"
              label="Date de visa"
              rules={[
                {
                  required: true,
                  message: "Veuillez sélectionner la date de visa",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
              />
            </Form.Item>

            <Form.Item
              name="dateApprobation_NOTIF"
              label="Date d'approbation"
              rules={[
                {
                  required: true,
                  message: "Veuillez sélectionner la date d'approbation",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default List_Notification;
