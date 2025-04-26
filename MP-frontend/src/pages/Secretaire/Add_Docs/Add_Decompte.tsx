import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Select,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { createDecompte } from "../../../services/DecompteService";
import { getMarches } from "../../../services/MarcheService";
import { getSocietes } from "../../../services/SocieteService";
import { Marche } from "../../../services/MarcheService";
import { Societe } from "../../../services/SocieteService";
import dayjs from "dayjs";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import "../PagesSec.css";

const Add_Decompte = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [marches, setMarches] = useState<Marche[]>([]);
  const [societes, setSocietes] = useState<Societe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marchesData, societesData] = await Promise.all([
          getMarches(),
          getSocietes(),
        ]);
        setMarches(marchesData);
        setSocietes(societesData);
      } catch (error) {
        message.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        dateFait_D: values.dateFait_D.format("YYYY-MM-DD"),
        datePaiement: values.datePaiement.format("YYYY-MM-DD"),
        idMarche: values.idMarche,
        idSociete: values.societe_D,
      };
      await createDecompte(payload);
      message.success("Décompte ajouté avec succès !");
      form.resetFields();
      navigate("/Decompte"); // Change this route if needed
    } catch (error) {
      message.error("Erreur lors de l'ajout du décompte");
    }
  };

  return (
    <Sidebar>
      <div className="list-container">
        <div className="list-header">
          <h2 className="list-title">Ajouter un Décompte</h2>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: 600, margin: "0 auto" }}
        >
          <Form.Item
            name="idMarche"
            label="Marché"
            rules={[
              { required: true, message: "Veuillez sélectionner un marché" },
            ]}
          >
            <Select
              placeholder="Sélectionner le marché"
              loading={loading}
              showSearch
              optionFilterProp="label"
              options={marches.map((m) => ({
                value: m.id_Marche,
                label: m.numOrdre,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="societe_D"
            label="Société"
            rules={[
              { required: true, message: "Veuillez sélectionner une société" },
            ]}
          >
            <Select
              placeholder="Sélectionner la société"
              loading={loading}
              showSearch
              optionFilterProp="label"
              options={societes.map((s) => ({
                value: s.id_SO,
                label: s.raisonSociale,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="numOrdre_D"
            label="Numéro de Décompte"
            rules={[
              {
                required: true,
                message: "Le numéro de décompte est obligatoire",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="aCompte"
            label="Acompte"
            rules={[{ required: true, message: "L'acompte est obligatoire" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="somme_D"
            label="Somme"
            rules={[{ required: true, message: "La somme est obligatoire" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="dateFait_D"
            label="Date de Fait"
            rules={[
              { required: true, message: "La date de fait est obligatoire" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            name="datePaiement"
            label="Date de Paiement"
            rules={[
              {
                required: true,
                message: "La date de paiement est obligatoire",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Sidebar>
  );
};

export default Add_Decompte;
