import React, { useState, useEffect } from 'react';
import { Table, Modal, Input, FloatButton, Form, DatePicker, Select, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { getNotifications, deleteNotification, updateNotification } from '../../../services/NotificationService';
import Sidebar from '../../../components/Sidebar/Sidebar_Sec';
import '../PagesSec.css';
import dayjs from 'dayjs';

export interface Notification {
    id_NOTIF: number;
    numOrdre_NOTIF: string;
    dateVisa_NOTIF: string; // Will be sent as ISO string
    dateApprobation_NOTIF: string; // Will be sent as ISO string
}

const List_Notification = () => {
      const [isEditing, setIsEditing] = useState(false);
      const [editingNotification, setEditingNotification] = useState<Notification | null>(
        null
      );
      const [dataSource, setDataSource] = useState<Notification[]>([]);
      const [loading, setLoading] = useState(true);
      const navigate = useNavigate();
      const [form] = Form.useForm();
    
      // Charger les appels d'offre depuis l'API
      useEffect(() => {
        const fetchNotifications = async () => {
          try {
            const data = await getNotifications();
            setDataSource(data);
          } catch (error) {
            console.error(
              "Erreur lors de la récupération des notifications :",
              error
            );
          } finally {
            setLoading(false);
          }
        };
    
        fetchNotifications();
      }, []);
    
    
      const onDeleteNotification = async (record: Notification) => {
        Modal.confirm({
          title: "Êtes-vous sûr de vouloir supprimer cette notification ?",
          okText: "Oui",
          okType: "danger",
          onOk: async () => {
            try {
              await deleteNotification(record.numOrdre_NOTIF);
              setDataSource((pre) =>
                pre.filter((not) => not.numOrdre_NOTIF !== record.numOrdre_NOTIF)
              );
              message.success("La notification a été supprimée avec succès");
            } catch (error) {
              console.error(
                "Erreur lors de la suppression de la notification :",
                error
              );
              alert(
                "Impossible de supprimer la notification. Veuillez réessayer plus tard."
              );
            }
          },
        });
      };
    
      const onEditNotification = (record: Notification) => {
        setIsEditing(true);
        setEditingNotification({ ...record });
      };
    
      const handleSave = async () => {
        if (!editingNotification) return;
    
        try {
          if (!editingNotification.id_NOTIF) {
            message.error("ID de la notification manquant");
            return;
          }
          const updatedNotification = await updateNotification(editingNotification.id_NOTIF, editingNotification);
          
          // Refresh the list
          const newData = await getNotifications();
          setDataSource(newData);
          
          message.success("Notification mise à jour avec succès");
          resetEditing();
        } catch (error) {
          console.error(
            "Erreur lors de la mise à jour de la notification :",
            error
          );
          message.error("Erreur lors de la mise à jour de la notification");
          alert(
            "Impossible de mettre à jour la notification. Veuillez réessayer plus tard."
          );
        }
      };
    
      const resetEditing = () => {
        setIsEditing(false);
        setEditingNotification(null);
      };

    const columns = [
        {
            title: 'Numéro de Notification',
            dataIndex: 'numOrdre_NOTIF',
            key: 'numOrdre_NOTIF',
            sorter: (a: any, b: any) => a.numOrdre_NOTIF.localeCompare(b.numOrdre_NOTIF)
        },
        {
            title: 'Date de Visa',
            dataIndex: 'dateVisa_NOTIF',
            key: 'dateVisa_NOTIF',
            render: (date: string) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Date d\'Approbation',
            dataIndex: 'dateApprobation_NOTIF',
            key: 'dateApprobation_NOTIF',
            render: (date: string) => new Date(date).toLocaleDateString()
        },
        {
            title: "Actions",
            render: (record: Notification) => (
            <>
            <EditOutlined onClick={() => onEditNotification(record)} />
            <DeleteOutlined
                onClick={() => onDeleteNotification(record)}
                style={{ color: "red", marginLeft: 12 }}
            />
            </>
            ),
        }
    ];

    return (
        <Sidebar>
        <div className="list-container">
        <FloatButton icon={<PlusOutlined />} onClick={() => navigate("/add-notification")} />
        <div className="list-header">
          <h2 className="list-title">Liste des Notifications</h2>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id_NOTIF"
          loading={loading}
        />
         <Modal 
          title="Modifier la notification" 
          open={isEditing} 
          onCancel={resetEditing} 
          onOk={() => form.submit()}
          width={500}
        >
          <Form 
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Form.Item label="Numéro de notification">
              <Input
                value={editingNotification?.numOrdre_NOTIF}
                disabled
              />
            </Form.Item>

            <Form.Item label="Date de visa">
              <DatePicker
                style={{ width: "100%" }}
                value={editingNotification?.dateVisa_NOTIF ? dayjs(editingNotification.dateVisa_NOTIF) : null}
                onChange={(date) =>
                  setEditingNotification((pre) =>
                    pre ? { ...pre, dateVisa_NOTIF: date ? date.format("YYYY-MM-DD") : "" } : pre
                  )
                }
              />
            </Form.Item>

            <Form.Item label="Date d'approbation">
              <DatePicker
                style={{ width: "100%" }}
                value={editingNotification?.dateApprobation_NOTIF ? dayjs(editingNotification.dateApprobation_NOTIF) : null}
                onChange={(date) =>
                  setEditingNotification((pre) =>
                    pre ? { ...pre, dateApprobation_NOTIF: date ? date.format("YYYY-MM-DD") : "" } : pre
                  )
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
