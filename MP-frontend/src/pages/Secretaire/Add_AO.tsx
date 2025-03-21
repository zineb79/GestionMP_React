import React from 'react';
import { Form, Button, DatePicker, Input, Select, FloatButton } from "antd";
import Sidebare from '../../components/Sidebar/Sidebar_Sec';  
import './PagesSec.css';

const Add_AO = () => {
  return (
    <Sidebare> {/* Encapsule le formulaire dans Sidebare */}
      <div className="form">
        <h1>Ajouter un appel d'offre</h1>
        <Form
          autoComplete="off"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          onFinish={(values) => console.log({ values })}
          onFinishFailed={(error) => console.log({ error })}
        >
          <Form.Item name="marche_AO" label="Marché" >
          <Select placeholder="Selectionner le marché">
            <Select.Option value="ENCOURS">ENCOURS</Select.Option>
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
            { whitespace: true }
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
            { whitespace: true }
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
          <Button block type="primary" htmlType="submit" className='ajouter'>
            Ajouter
          </Button>
        </Form.Item>
        </Form>
      </div>
    </Sidebare>
  );
}

export default Add_AO;
