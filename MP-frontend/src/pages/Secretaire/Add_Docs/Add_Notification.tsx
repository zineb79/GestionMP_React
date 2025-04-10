import { Form, Button, DatePicker, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createNotification } from '../../../services/NotificationService';
import Sidebare from '../../../components/Sidebar/Sidebar_Sec';
import '../PagesSec.css';

const Add_Notification = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            const notificationData = {
                id_NOTIF: 0,
                numOrdre_NOTIF: values.numOrdre_NOTIF.trim(),
                dateVisa_NOTIF: values.dateVisa_NOTIF.format('YYYY-MM-DD'),
                dateApprobation_NOTIF: values.dateApprobation_NOTIF.format('YYYY-MM-DD')
            };

            await createNotification(notificationData);
            message.success('Notification créée avec succès');
            form.resetFields();
            navigate('/secretaire/list-notifications');
        } catch (error) {
            message.error('Erreur lors de la création de la notification');
            console.error('Error:', error);
        }
    };

    return (
        <Sidebare>
            <div className="list-container">
                <div className="list-header">
                    <h2 className="list-title">Ajouter une Notification d'approbation</h2>
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
                        name="numOrdre_NOTIF"
                        label="Numéro de Notification d'approbation"
                        rules={[
                            {
                                required: true,
                                message: "Le numéro de notification est obligatoire"
                            },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Tapez le numéro de notification" />
                    </Form.Item>

                    <Form.Item
                        name="dateVisa_NOTIF"
                        label="Date de Visa"
                        rules={[{ required: true, message: 'La date de visa est obligatoire' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="dateApprobation_NOTIF"
                        label="Date d'Approbation"
                        rules={[{ required: true, message: 'La date d\'approbation est obligatoire' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Button block type="primary" htmlType="submit" className='ajouter'>
                        Ajouter
                    </Button>
                </Form>
            </div>
        </Sidebare>
    );
};

export default Add_Notification;
