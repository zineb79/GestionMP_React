import React from 'react';
import { Form, Button, DatePicker, Input, Select, FloatButton, message } from "antd";
import Sidebare from '../../../components/Sidebar/Sidebar_Sec';  
import '../PagesSec.css';
import { useNavigate } from 'react-router-dom';
import { createMarche } from '../../../services/MarcheService';

const Add_Marche = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    console.log('Form values:', values);
    if (!values.numOrdre || values.numOrdre.trim() === '') {
      message.error('Le numéro de marché est obligatoire');
      return;
    }
    try {
      const marcheData = {
        id_Marche: 0,
        numOrdre: values.numOrdre.trim(),
        type_Marche: values.type_Marche,
        objet_marche: values.objet_marche,
        statut: values.statut,
        idSociete: null,
        idNotification: null,
        delaisGarantie: 0,
        delaisMarche: values.delaisMarche ? values.delaisMarche.format('YYYY-MM-DD') : '',
        chefServiceConcerne: "",
        serviceConcerne: "",
        montantFinal: 0,
        isArchived: false,
        societe: {
          id_SO: 0,
          raisonSociale: "",
          adresse: "",
          ville: "",
          telephone: "",
          email: "",
          idFiscale: ""
        }
      };
      console.log('Sending to backend:', marcheData);
      await createMarche(marcheData);
      message.success('Marché ajouté avec succès');
      form.resetFields();
      navigate('/list-marche');
    } catch (error) {
      console.error("Erreur lors de l'ajout du marché:", error);
      message.error("Erreur lors de l'ajout du marché");
    }
  };

  return (
    <Sidebare> {/* Encapsule le formulaire dans Sidebare */}
      <div className="list-container" >
        <div className="list-header">
          <h2 className="list-title">Ajouter un Marché</h2>
        </div>
        <Form
          form={form}
          autoComplete="off"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          onFinish={onFinish}
          onFinishFailed={(error) => console.log({ error })}
        >

        <Form.Item
          name="numOrdre"
          label="Numero de Marché"
          rules={[
            {
              required: true,
              message: "Le numéro de marché est obligatoire"
            },
            {
              pattern: /^[a-zA-Z0-9-_/]+$/,
              message: "Le numéro de marché ne doit contenir que des lettres, chiffres, tirets et underscores"
            }
          ]}
          hasFeedback
        >
          <Input placeholder="Tapez le numero de marché" />
        </Form.Item>

        <Form.Item name="type_Marche" label="Type de Marché" initialValue="TRAVAUX">
          <Select placeholder="Selectionner le type de marché">
            <Select.Option value="TRAVAUX">TRAVAUX</Select.Option>
            <Select.Option value="FOURNITURE">FOURNITURE</Select.Option>
            <Select.Option value="PRESTATION_SERVICE">PRESTATION_SERVICE</Select.Option>
          </Select>
          </Form.Item>

        <Form.Item name="statut" label="Statut" initialValue="EnPreparation">
        <Select placeholder="Selectionner le statut">
          <Select.Option value="EnPreparation">En Préparation</Select.Option>
          <Select.Option value="EnCoursTraitement">En Cours de Traitement</Select.Option>
          <Select.Option value="Cloture">Cloturé</Select.Option>
          <Select.Option value="Adjuge">Adjugé</Select.Option>
          <Select.Option value="Acheve">Achevé</Select.Option>
          <Select.Option value="EnArret">En Arrêt</Select.Option>
          <Select.Option value="Notifie">Notifié</Select.Option>
        </Select>
        </Form.Item>

        <Button block type="primary" htmlType="submit" className='ajouter'>
          Ajouter
        </Button>
        </Form>
      </div>
    </Sidebare>
  );
}

export default Add_Marche;
