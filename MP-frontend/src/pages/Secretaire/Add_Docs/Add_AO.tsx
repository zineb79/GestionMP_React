import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  DatePicker,
  Input,
  Select,
  FloatButton,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import { getMarches, createAppelOffre } from "../../../services/AuthService";
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

const Add_AO = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [marches, setMarches] = useState<Marche[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarches = async () => {
      try {
        console.log("Début de la récupération des marchés...");
        const data = await getMarches();
        console.log(
          "Données des marchés reçues:",
          JSON.stringify(data, null, 2)
        );
        if (data && Array.isArray(data)) {
          setMarches(data);
        } else {
          console.error("Les données reçues ne sont pas un tableau:", data);
          setMarches([]);
        }
      } catch (error) {
        console.error(
          "Erreur détaillée lors de la récupération des marchés :",
          error
        );
        setMarches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarches();
  }, []);

  const onFinish = async (values: any) => {
    try {
      // Vérification du marché sélectionné
      if (!values.idMarche) {
        message.error("Veuillez sélectionner un marché");
        return;
      }

      console.log("Marché sélectionné (raw):", values.idMarche);
      console.log("Type du marché sélectionné:", typeof values.idMarche);
      console.log("Liste des marchés disponibles:", marches);

      // Convertir la date en format ISO
      const date_AO = values.date_AO
        ? values.date_AO.format("YYYY-MM-DD")
        : null;

      // Convertir les coûts en nombres
      const coutEstime_AO = parseFloat(values.coutEstime_AO);
      const cautionProvisoire_AO = parseFloat(values.cautionProvisoire_AO);

      const idMarche = parseInt(values.idMarche);
      console.log("Marché converti:", idMarche);

      const appelOffre = {
        num_Ordre_AO: values.num_Ordre_AO.toString(),
        type_AO: values.type_AO,
        date_AO: date_AO,
        coutEstime_AO: coutEstime_AO,
        cautionProvisoire_AO: cautionProvisoire_AO,
        statut_AO: values.statut_AO,
        idMarche: idMarche,
      };

      console.log("Données à envoyer:", JSON.stringify(appelOffre, null, 2));

      if (!appelOffre.idMarche || appelOffre.idMarche === 0) {
        message.error("Le marché sélectionné n'est pas valide");
        return;
      }

      await createAppelOffre(appelOffre);
      message.success("L'appel d'offre a été ajouté avec succès");
      navigate("/list-ao");
    } catch (error) {
      console.error("Erreur détaillée:", error);
      message.error(
        "Une erreur est survenue lors de l'ajout de l'appel d'offre"
      );
    }
  };

  return (
    <Sidebar>
      <div className="form">
        <h1>Ajouter un appel d'offre</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={(error) => {
            console.log("Erreur de validation:", error);
            message.error(
              "Veuillez remplir tous les champs requis correctement"
            );
          }}
        >
          <Form.Item
            name="idMarche"
            label="Marché"
            rules={[
              { required: true, message: "Veuillez sélectionner un marché" },
            ]}
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
            name="num_Ordre_AO"
            label="Numero d'ordre"
            rules={[
              {
                required: true,
                message: "Veuillez entrer Numero d'ordre",
              },
              { whitespace: true },
            ]}
          >
            <Input placeholder="Tapez le numero" />
          </Form.Item>

          <Form.Item
            name="type_AO"
            label="Type d'appel d'offre"
            rules={[
              {
                required: true,
                message: "Veuillez entrer le type",
              },
              { whitespace: true },
            ]}
            hasFeedback
          >
            <Input placeholder="Taper le type" />
          </Form.Item>
          <Form.Item
            name="date_AO"
            label="Date d'appel d'offre"
            rules={[
              {
                required: true,
                message: "Veuillez entrer la date",
              },
            ]}
            hasFeedback
          >
            <DatePicker
              style={{ width: "100%" }}
              picker="date"
              placeholder="Choisir la date"
            />
          </Form.Item>

          <Form.Item
            name="coutEstime_AO"
            label="Coût estimé"
            rules={[
              {
                required: true,
                message: "Veuillez entrer le coût estimé.",
              },
              {
                pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: "Veuillez entrer un nombre valide .",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Entrez le coût estimé" />
          </Form.Item>

          <Form.Item
            name="cautionProvisoire_AO"
            label="Coût provisoire"
            rules={[
              {
                required: true,
                message: "Veuillez entrer le coût provisoire.",
              },
              {
                pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: "Veuillez entrer un nombre valide.",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Entrez le coût provisoire" />
          </Form.Item>

          <Form.Item name="statut_AO" label="Statut" initialValue="ENCOURS">
          <Select placeholder="Sélectionner le statut" loading={loading}>
            <Select.Option value="ENCOURS">ENCOURS</Select.Option>
            <Select.Option value="VALIDE">VALIDE</Select.Option>
            <Select.Option value="INFRUTUEUSE">INFRUTUEUSE</Select.Option>
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

export default Add_AO;
