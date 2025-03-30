import React, { useState, useEffect } from "react";
import { Form, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import { getMarches, createOrdreDeService } from "../../../services/AuthService";
import "../PagesSec.css";

interface Marche {
  id_Marche: number;
  numOrdre: string;
  type_Marche: string;
  objet_marche: string;
  statut: string;
  idSociete: number | null;
  idNotification: number | null;
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

      const ordreDeService = {
        type_OS: values.type_OS,
        marche_OS: marches.find(m => m.id_Marche === values.marche_OS) || {
          id_Marche: values.marche_OS,
          numOrdre: "",
          objet_marche: ""
        }
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
      <div className="form">
        <h1>Ajouter un ordre de service</h1>
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

          <Form.Item
            name="type_OS"
            label="Type d'ordre de service"
            rules={[{ required: true, message: "Veuillez sélectionner le type" }]}
          >
            <Select placeholder="Sélectionner le type">
              <Select.Option value="commencement">Commencement</Select.Option>
              <Select.Option value="arret">Arret</Select.Option>
              <Select.Option value="reprise">Reprise</Select.Option>
              <Select.Option value="cession">Cession</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button block type="primary" htmlType="submit" className="ajouter">
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Sidebar>
  );
};

export default Add_OS;
