import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  FloatButton,
  Form,
  Select,
  message,
  DatePicker,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getPvReceptions,
  deletePvReception,
  updatePvReception,
  TypePvReception,
  PvReception,
  PvReceptionWithNumOrdre,
} from "../../../services/PvReceptionService";
import { Marche, getMarches } from "../../../services/MarcheService";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import "../PagesSec.css";
import dayjs from "dayjs";

const List_PvReceptions = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPvReception, setEditingPvReception] =
    useState<PvReception | null>(null);
  const [dataSource, setDataSource] = useState<PvReceptionWithNumOrdre[]>([]);
  const [marches, setMarches] = useState<Marche[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const pvData = await getPvReceptions();
        setDataSource(pvData);
        const marcheData = await getMarches();
        setMarches(marcheData);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onDeletePvReception = async (record: PvReception) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer ce PV de réception ?",
      okText: "Oui",
      okType: "danger",
      onOk: async () => {
        if (!record.id_PVR) return;
        try {
          await deletePvReception(record.id_PVR);
          setDataSource((pre) =>
            pre.filter((pv) => pv.id_PVR !== record.id_PVR)
          );
          message.success("Le PV de réception a été supprimé avec succès");
        } catch (error) {
          message.error("Erreur lors de la suppression du PV de réception");
          console.error("Error:", error);
        }
      },
    });
  };

  const onEditPvReception = (record: PvReception) => {
    setIsEditing(true);
    setEditingPvReception(record);
    form.setFieldsValue({
      ...record,
      type_PVR: record.type_PVR,
      date: record.date ? dayjs(record.date) : null,
      idMarche_PVR: record.idMarche_PVR,
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (!editingPvReception) {
        message.error("Aucun PV de réception sélectionné");
        return;
      }

      const selectedMarche = marches.find(
        (m) => m.id_Marche === values.idMarche_PVR
      );

      if (!selectedMarche) {
        message.error("Marché sélectionné introuvable");
        return;
      }

      const updatedPv = {
        ...editingPvReception,
        ...values,
        type_PVR: values.type_PVR,
        date: values.date ? values.date.format("YYYY-MM-DD") : "",
        idMarche_PVR: values.idMarche_PVR,
      };

      const updatedPvReception = await updatePvReception(updatedPv);

      const marcheForUpdated = marches.find(
        (m) => m.id_Marche === updatedPvReception.idMarche_PVR
      );
      const finalUpdatedPv = {
        ...updatedPvReception,
        marche_PVR_obj: marcheForUpdated,
      };

      setDataSource(
        dataSource.map((pv) =>
          pv.id_PVR === finalUpdatedPv.id_PVR ? finalUpdatedPv : pv
        )
      );

      setIsEditing(false);
      setEditingPvReception(null);
      message.success("Le PV de réception a été mis à jour avec succès");
    } catch (error) {
      message.error("Erreur lors de la mise à jour du PV de réception");
      console.error("Error:", error);
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingPvReception(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id_PVR",
      key: "id_PVR",
    },
    {
      title: "Type",
      dataIndex: "type_PVR",
      key: "type_PVR",
      render: (type: TypePvReception) => {
        switch (type) {
          case TypePvReception.PROVISOIRE:
            return "Provisoire";
          case TypePvReception.DEFINITIVE:
            return "Définitif";
          default:
            return type;
        }
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string | undefined) =>
        date ? dayjs(date).format("DD/MM/YYYY") : "N/A",
    },
    {
      title: "Num OrdreMarché",
      dataIndex: "numOrdreMarche",
      key: "numOrdreMarche",
      render: (text: string | undefined) => text || "N/A",
      sorter: (a: PvReceptionWithNumOrdre, b: PvReceptionWithNumOrdre) =>
        (a.numOrdreMarche || "").localeCompare(b.numOrdreMarche || ""),
    },
    {
      title: "Actions",
      render: (record: PvReception) => (
        <>
          <EditOutlined
            onClick={() => onEditPvReception(record)}
            style={{ color: "#1890ff", cursor: "pointer" }}
          />
          {/*
          <DeleteOutlined
            onClick={() => onDeletePvReception(record)}
            style={{ color: "red", marginLeft: 12, cursor: "pointer" }}
          />
          */}
        </>
      ),
    },
  ];

  return (
    <div>
      <Sidebar>
        <div className="list-container">
          <div className="list-header">
            <h2 className="list-title">Liste des PV de Réception</h2>
          </div>
          <FloatButton
            icon={<PlusOutlined />}
            onClick={() => navigate("/AddPV")}
            tooltip="Ajouter un nouveau PV"
          />
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey="id_PVR"
            loading={loading}
            bordered
          />

          <Modal
            title="Modifier le PV de réception"
            open={isEditing}
            onCancel={resetEditing}
            onOk={handleSave}
            okText="Enregistrer"
            cancelText="Annuler"
          >
            <Form form={form} layout="vertical">
              <Form.Item
                label="Type de PV"
                name="type_PVR"
                rules={[
                  { required: true, message: "Veuillez sélectionner le type" },
                ]}
              >
                <Select>
                  <Select.Option value={TypePvReception.PROVISOIRE}>
                    Provisoire
                  </Select.Option>
                  <Select.Option value={TypePvReception.DEFINITIVE}>
                    Définitif
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Date de réception"
                name="date"
                rules={[
                  { required: true, message: "Veuillez sélectionner la date" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Marché"
                name="idMarche_PVR"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner le marché",
                  },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {marches.map((marche) => (
                    <Select.Option
                      key={marche.id_Marche}
                      value={marche.id_Marche}
                      label={marche.numOrdre}
                    >
                      {marche.numOrdre} - {marche.objet_marche}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Sidebar>
    </div>
  );
};

export default List_PvReceptions;
