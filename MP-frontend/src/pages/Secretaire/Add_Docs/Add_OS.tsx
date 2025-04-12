import React, { useState, useEffect } from "react";
import { Form, Button, Select, message, Input, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import { createOrdreDeService } from "../../../services/OSService";
import "../PagesSec.css";
import { getMarches } from "../../../services/MarcheService";
import { OrdreDeService, Type_OS } from "../../../services/OSService";
import { Marche } from "../../../services/MarcheService";

const Add_OS = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [marches, setMarches] = useState<Marche[]>([]);

  useEffect(() => {
    const fetchMarches = async () => {
      try {
        const data = await getMarches();
        setMarches(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des marchés:", error);
      }
    };
    fetchMarches();
  }, []);

  const onFinish = async (values: any) => {
    try {
      const date_OS = values.date_OS ? values.date_OS.format("YYYY-MM-DD") : null;

      const ordreDeService = {
        numOrdre_OS: values.numOrdre_OS,
        type_OS: values.type_OS,
        date_OS: date_OS,
        marche_OS: values.marche_OS
      };

      await createOrdreDeService(ordreDeService);
      message.success("L'ordre de service a été ajouté avec succès");
      navigate("/list-os");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'ordre de service :", error);
      message.error("Une erreur est survenue lors de l'ajout de l'ordre de service");
    }
  };

  return (
    <Sidebar>
      <div className="list-container">
        <div className="list-header">
          <h2 className="list-title">Ajouter un ordre de service</h2>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={(error) => {
            console.log("Failed:", error);
          }}
        >
          <Form.Item
            name="idMarche"
            label="Marché"
            rules={[
              { required: true, message: "Veuillez sélectionner un marché" },
            ]}
          >
            <Select placeholder="Sélectionner le marché">
              {marches && marches.length > 0 ? (
                marches.map((marche) => (
                  <Select.Option
                    key={marche.id_Marche}
                    value={marche.id_Marche}
                    disabled={!marche.id_Marche}
                  >
                    {`${marche.numOrdre} - ${marche.objet_marche}`}
                  </Select.Option>
                ))
              ) : (
                <Select.Option value="" disabled>
                  Aucun marché disponible
                </Select.Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name="numOrdre_OS"
            label="Numéro d'OS"
            rules={[{ required: true, message: 'Veuillez entrer le numéro d\'OS' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type_OS"
            label="Type d'OS"
            rules={[{ required: true, message: 'Veuillez sélectionner un type d\'OS' }]}
          >
            <Select>
              {Object.values(Type_OS).map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date_OS"
            label="Date d'ordre de service"
            rules={[{ required: true, message: 'Veuillez sélectionner une date' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="ajouter">
            Ajouter
          </Button>
        </Form>
      </div>
    </Sidebar>
  );
};

export default Add_OS;
