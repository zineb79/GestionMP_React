import { Form, Button, DatePicker, Input, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createNotification } from '../../../services/NotificationService';
import Sidebare from '../../../components/Sidebar/Sidebar_Sec';
import '../PagesSec.css';
import { getMarches } from '../../../services/MarcheService';
import { useEffect, useState } from 'react';
import { Marche } from '../../../services/MarcheService';
import { Societe } from '../../../services/SocieteService';
import { getSocietes } from '../../../services/SocieteService';

const Add_Notification = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [marches, setMarches] = useState<Marche[]>([]);
    const [societes, setSocietes] = useState<Societe[]>([]);
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
                    
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des marchés:", error);
            }
        };

        const fetchSocietes = async () => {
            try {
                const data = await getSocietes();
                console.log(
                    "Données des sociétés reçues:",
                    JSON.stringify(data, null, 2)
                );
                if (data && Array.isArray(data)) {
                    setSocietes(data);
                } else {
                    console.error("Les données reçues ne sont pas un tableau:", data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des sociétés:", error);
            }
        };

        Promise.all([fetchMarches(), fetchSocietes()]).finally(() => {
            setLoading(false);
        });
    }, []);

    const onFinish = async (values: any) => {
        try {
            const selectedSociete = societes.find(societe => societe.idFiscale === values.id_SO);
            if (!selectedSociete) {
                throw new Error('Société non trouvée');
            }

            const notificationData = {
                notificationAppr: {
                    id_NOTIF: 0,
                    numOrdre_NOTIF: values.numOrdre_NOTIF,
                    dateVisa_NOTIF: values.dateVisa_NOTIF.format('YYYY-MM-DD'),
                    dateApprobation_NOTIF: values.dateApprobation_NOTIF.format('YYYY-MM-DD'),
                    marche_NOTIF: {
                        id_Marche: values.idMarche,
                        numOrdre: values.numOrdre_NOTIF.trim(),
                        type_Marche: '',
                        objet_marche: '',
                        statut: '',
                        delaisGarantie: 0,
                        delaisMarche: '',
                        chefServiceConcerne: '',
                        serviceConcerne: '',
                        montantFinal: null,
                        isArchived: false,
                        societe: {
                            id_SO: parseInt(selectedSociete.idFiscale.toString()),
                            raisonSociale: selectedSociete.raisonSociale,
                            adresse: selectedSociete.adresse,
                            ville: selectedSociete.ville,
                            telephone: selectedSociete.telephone,
                            email: selectedSociete.email,
                            idFiscale: selectedSociete.idFiscale
                        }
                    }
                }
            };

            await createNotification(notificationData);
            message.success('Notification créée avec succès');
            form.resetFields();
            navigate('/list-notification');
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
                        name="id_SO"
                        label="Société"
                        rules={[
                        { required: true, message: "Veuillez sélectionner une société" },
                        ]}
                    >
                        <Select placeholder="Sélectionner la société" loading={loading}>
                        {societes && societes.length > 0 ? (
                            societes.map((societe) => (
                            <Select.Option
                                key={societe.idFiscale}
                                value={societe.idFiscale}
                                disabled={!societe.idFiscale}
                            >
                                {`${societe.raisonSociale}`}
                            </Select.Option>
                            ))
                        ) : (
                            <Select.Option value="" disabled>
                            Aucune société disponible
                            </Select.Option>
                        )}
                        </Select>
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
