import React, { useState, useEffect } from "react";
import { Form, Button, DatePicker, Input, Select, FloatButton } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar_Sec";
import api from "../../utils/axiosInstance";
import { getMarches } from "../../services/AuthService";
import "./PagesSec.css";

interface Marche {
  idMarche: number;
  nomMarche: string;
  statutMarche: string;
}

const Add_AO = () => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchMarches();
  }, []);

  return (
    <Sidebar>
      <div className="form">
        <h1>Ajouter un appel d'offre</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => console.log({ values })}
          onFinishFailed={(error) => console.log({ error })}
        >
          <Form.Item
            name="marche_AO"
            label="Marché"
            rules={[
              { required: true, message: "Veuillez sélectionner un marché" },
            ]}
          >
            <Select placeholder="Sélectionner le marché" loading={loading}>
              {marches.map((marche) => (
                <Select.Option key={marche.idMarche} value={marche.idMarche}>
                  {marche.nomMarche}
                </Select.Option>
              ))}
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
            <Select placeholder="Selectionner le statut">
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
