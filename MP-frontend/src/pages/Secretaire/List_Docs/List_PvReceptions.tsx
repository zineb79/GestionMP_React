import React, { useState, useEffect } from 'react';
import { Table, Modal, Input, FloatButton, Form, Select, message, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getPvReceptions, deletePvReception, updatePvReception, TypePvReception } from '../../../services/PvReceptionService';
import Sidebar from '../../../components/Sidebar/Sidebar_Sec';
import '../PagesSec.css';
import dayjs from 'dayjs';

export interface PvReception {
    id_PVR: number;
    type_PVR: TypePvReception;
    date_PVR: string;
    marche_PVR: {
        id_M: number;
        numOrdre_M: string;
    };
}

const List_PvReceptions = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPvReception, setEditingPvReception] = useState<PvReception | null>(null);
  const [dataSource, setDataSource] = useState<PvReception[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchPvReceptions = async () => {
      try {
        const data = await getPvReceptions();
        setDataSource(data);
      } catch (error) {
        console.error('Error fetching PV receptions:', error);
        message.error('Erreur lors du chargement des PV de réception');
      } finally {
        setLoading(false);
      }
    };

    fetchPvReceptions();
  }, []);

  const onDeletePvReception = async (record: PvReception) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer ce PV de réception ?",
      okText: "Oui",
      okType: "danger",
      onOk: async () => {
        try {
          await deletePvReception(record.id_PVR);
          setDataSource((pre) => pre.filter((pv) => pv.id_PVR !== record.id_PVR));
          message.success("Le PV de réception a été supprimé avec succès");
        } catch (error) {
          message.error("Erreur lors de la suppression du PV de réception");
          console.error('Error:', error);
        }
      },
    });
  };

  const onEditPvReception = (record: PvReception) => {
    setIsEditing(true);
    setEditingPvReception({ ...record });
  };

  const handleSave = async () => {
    if (!editingPvReception) return;

    try {
      if (!editingPvReception.id_PVR) {
        message.error("ID du PV de réception manquant");
        return;
      }

      const updatedPvReception = await updatePvReception(editingPvReception);
      
      // Refresh the list
      const newData = await getPvReceptions();
      setDataSource(newData);
      
      setIsEditing(false);
      setEditingPvReception(null);
      message.success("Le PV de réception a été mis à jour avec succès");
    } catch (error) {
      message.error("Erreur lors de la mise à jour du PV de réception");
      console.error('Error:', error);
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingPvReception(null);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id_PVR',
      key: 'id_PVR',
    },
    {
      title: 'Type',
      dataIndex: 'type_PVR',
      key: 'type_PVR',
      render: (type: TypePvReception) => {
        switch (type) {
          case TypePvReception.PROVISOIRE:
            return 'Provisoire';
          case TypePvReception.DEFINITIVE:
            return 'Définitif';
          default:
            return type;
        }
      },
    },
    {
      title: 'Date',
      dataIndex: 'date_PVR',
      key: 'date_PVR',
    },
    {
      title: 'Marché',
      dataIndex: 'marche_PVR',
      key: 'marche_PVR',
      render: (marche: any) => marche?.numOrdre_M,
    },
    {
      title: 'Actions',
      render: (record: PvReception) => (
        <>
          <EditOutlined onClick={() => onEditPvReception(record)} />
          <DeleteOutlined
            onClick={() => onDeletePvReception(record)}
            style={{ color: 'red', marginLeft: 8 }}
          />
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
          <FloatButton icon={<PlusOutlined />} onClick={() => navigate("/add-pv")} />
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey="id_PVR"
            loading={loading}
          />

          {isEditing && (
            <Modal
              title="Modifier le PV de réception"
              open={isEditing}
              onCancel={resetEditing}
              footer={null}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
              >
                <Form.Item
                  label="Type de PV"
                  name="type_PVR"
                  initialValue={editingPvReception?.type_PVR}
                >
                  <Select>
                    <Select.Option value="PROVISOIRE">Provisoire</Select.Option>
                    <Select.Option value="DEFINITIVE">Définitif</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Date de réception"
                  name="date_PVR"
                  initialValue={editingPvReception?.date_PVR}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    value={editingPvReception?.date_PVR ? dayjs(editingPvReception.date_PVR) : null}
                    onChange={(date) =>
                      setEditingPvReception((pre) =>
                        pre ? { ...pre, date_PVR: date ? date.format("YYYY-MM-DD") : "" } : pre
                      )
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Marché"
                  name="marche_PVR"
                  initialValue={editingPvReception?.marche_PVR}
                >
                  <Select>
                    {dataSource.map((pv) => (
                      <Select.Option key={pv.id_PVR} value={pv.id_PVR}>
                        {pv.marche_PVR?.numOrdre_M}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            </Modal>
          )}
        </div>
      </Sidebar>
    </div>
  );
};

export default List_PvReceptions;
