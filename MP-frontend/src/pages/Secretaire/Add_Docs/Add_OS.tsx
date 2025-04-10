import React, { useState, useEffect } from "react";
import { Form, Button, Select, message, Input, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import { createOrdreDeService } from "../../../services/OSService";
import "../PagesSec.css";
import { getMarches } from "../../../services/MarcheService";

interface Marche {
  id_Marche: number;
  numOrdre: string;
  type_Marche: string;
  objet_marche: string;
  statut: string;
  idSociete: number | null;
  idNotification: number | null;
}

enum Type_OS {
  TYPE1 = "TYPE1",
  TYPE2 = "TYPE2",
  TYPE3 = "TYPE3"
}

interface OrdreDeService {
  type_OS: Type_OS;
  nom_OS: string;
  date_OS: string;
  marche_OS: number;
}

const Add_OS = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [marches, setMarches] = useState<Marche[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarches = async () => {
      try {
        const data = await getMarches();
        setMarches(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des marchés :", error);
        setMarches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarches();
  }, []);

  const onFinish = async (values: any) => {
    try {
      if (!values.marche_OS) {
        message.error("Veuillez sélectionner un marché");
        return;
      }

      const date_OS = values.date_OS
        ? typeof values.date_OS === 'object' 
          ? values.date_OS.format("YYYY-MM-DD")
          : values.date_OS
        : null;

      const ordreDeService = {
        type_OS: values.type_OS,
        nom_OS: values.nom_OS,
        date_OS: date_OS,
        marche_OS: marches.find(m => m.id_Marche === values.marche_OS)?.id_Marche || values.marche_OS
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
            console.log("Erreur de validation:", error);
            message.error("Veuillez remplir tous les champs requis correctement");
          }}
        >
          <Form.Item
            name="type_OS"
            label="Type d'Ordre de Service"
            rules={[{ required: true, message: "Veuillez sélectionner un type" }]}
          >
            <Select placeholder="Sélectionner le type">
              {Object.values(Type_OS).map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="numOrdre_OS"
            label="Numéro de l'Ordre de Service"
            rules={[{ required: true, message: "Veuillez entrer un numéro" }]}
          >
            <Input placeholder="Entrer le numéro" />
          </Form.Item>

          <Form.Item
            name="date_OS"
            label="Date de l'Ordre de Service"
            rules={[{ required: true, message: "Veuillez sélectionner une date" }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="marche_OS"
            label="Marché"
            rules={[{ required: true, message: "Veuillez sélectionner un marché" }]}
          >
            <Select placeholder="Sélectionner le marché" loading={loading}>
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

          <Button type="primary" htmlType="submit" className="ajouter">
            Ajouter
          </Button>
        </Form>
      </div>
    </Sidebar>
  );
};

export default Add_OS;
