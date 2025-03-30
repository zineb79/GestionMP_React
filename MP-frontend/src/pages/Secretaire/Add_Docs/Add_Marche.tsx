import React from 'react';
import { Form, Button, DatePicker, Input, Select, FloatButton } from "antd";
import Sidebare from '../../../components/Sidebar/Sidebar_Sec';  
import '../PagesSec.css';


const Add_Marche = () => {
  return (
    <Sidebare> {/* Encapsule le formulaire dans Sidebare */}
      <div className="form">
        <h1>Ajouter un Marché</h1>
        <Form
          autoComplete="off"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          onFinish={(values) => console.log({ values })}
          onFinishFailed={(error) => console.log({ error })}
        >

        <Form.Item
          name="numMarche"
          label="Numero de Marché"
          rules={[
            {
              required: true,
              message: "Champs obligatoire",
            },
            { whitespace: true }
          ]}
        >
          <Input placeholder="Tapez le numero de marché" />
        </Form.Item>

        <Form.Item name="typeMarche" label="Type de Marché" initialValue="TRAVAUX">
          <Select placeholder="Selectionner le type de marché">
            <Select.Option value="TRAVAUX">TRAVAUX</Select.Option>
            <Select.Option value="FOURNITURE">FOURNITURE</Select.Option>
            <Select.Option value="PRESTATION_SERVICE">PRESTATION_SERVICE</Select.Option>
          </Select>
          </Form.Item>
          
        <Form.Item
          name="objet_marche"
          label="Objet de Marché"
          rules={[
            {
              required: true,
              message: "Champs obligatoire",
            },
            { whitespace: true }
          ]}
          hasFeedback >
          <Input placeholder="Taper l'objet de marché" />
        </Form.Item>

        <Form.Item name="statutMarche" label="Statut" initialValue="ENCOURS">
        <Select placeholder="Selectionner le statut">
          <Select.Option value="EnAttente">EnAttente</Select.Option>
          <Select.Option value="ENCOURS">ENCOURS</Select.Option>
          <Select.Option value="Valide">Valide</Select.Option>
          <Select.Option value="NonValide">NonValide</Select.Option>
          <Select.Option value="Cloture">Cloture</Select.Option>
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

export default Add_Marche;
