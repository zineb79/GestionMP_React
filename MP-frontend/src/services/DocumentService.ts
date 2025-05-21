import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { SecureDocumentService } from '../config/SecurityService';
import { AppelOffre } from './AOService';
import { Notification } from './NotificationService';

interface TemplateErrorProperties {
  errors: Array<{
    properties: {
      placeholder: string;
    };
  }>;
}

// Utility function to convert numbers to words in French
const numberToWords = (number: number): string => {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
  const thousands = ['', 'mille', 'million', 'milliard'];

  const convertHundreds = (n: number): string => {
    let result = '';
    if (n >= 100) {
      result += units[Math.floor(n / 100)] + ' cent ';
      n %= 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)];
      n %= 10;
      if (n > 0) {
        result += '-' + units[n];
      }
    } else if (n >= 10) {
      result += teens[n - 10];
    } else if (n > 0) {
      result += units[n];
    }
    return result.trim();
  };

  if (number === 0) return 'zéro';
  if (number < 0) return 'moins ' + numberToWords(-number);

  // Separate integer and decimal parts
  let integerPart = Math.floor(number);
  const decimalPart = Math.floor((number - integerPart) * 100);

  let result = '';
  let i = 0;

  while (integerPart > 0) {
    const thousandsPart = integerPart % 1000;
    if (thousandsPart > 0) {
      result = convertHundreds(thousandsPart) + ' ' + thousands[i] + (result ? ' ' + result : '');
    }
    integerPart = Math.floor(integerPart / 1000);
    i++;
  }

  // Add decimal part if it exists
  if (decimalPart > 0) {
    result += ' dirhams et ' + decimalPart + ' centimes';
  }

  return result.trim();
};

export class DocumentService {
  //************************************ Appel d'offre **************************************** 
  static async generateAppelOffreDocument(appelOffre: AppelOffre): Promise<void> {
    try {

      // Préparer les données pour le template
      const data = {
        numOrdreAO: appelOffre.num_Ordre_AO || '',
        dateOuverturePli_AO: appelOffre.dateOuverturePli_AO || '',
        heureOuverturePli_AO: appelOffre.heureOuverturePli_AO || '',
        typeAO: appelOffre.type_AO.toUpperCase() || '',
        idMarche: appelOffre.idMarche?.toString() || '',
        objetAO: appelOffre.marche_AO_obj?.objet_marche || '',
        coutEstimeAO: appelOffre.coutEstime_AO || 0,
        coutEstimeAOLetters: numberToWords(appelOffre.coutEstime_AO || 0),
        coutEstimeAONumeric: (appelOffre.coutEstime_AO || 0).toLocaleString('fr-FR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
        cautionProvisoireAO: appelOffre.cautionProvisoire_AO || 0,
        cautionProvisoireAOLetters: numberToWords(appelOffre.cautionProvisoire_AO || 0),
        cautionProvisoireAONumeric: (appelOffre.cautionProvisoire_AO || 0).toLocaleString('fr-FR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
      };

      // Générer le document sécurisé avec le template sécurisé
      await SecureDocumentService.generateSecureDocument(
        '/templates/AppelOffre.docx',
        data,
        `APPEL_OFFRE_${appelOffre.num_Ordre_AO}`
      );

    } catch (error: unknown) {
      // Gestion des erreurs sécurisées
      SecureDocumentService.handleSecurityError(error);
      throw new Error('Échec de génération du document sécurisé');
    }
  }

  //************************************ Notification **************************************** 
  static async generateNotificationDocument(notification: Notification): Promise<void> {
    try {
      // Préparer les données pour le template
      const marcheData = notification.marche_NOTIF_obj ? {
        numOrdreMarche: notification.marche_NOTIF_obj?.numOrdre,
        objetMarche: notification.marche_NOTIF_obj?.objet_marche,
        typeMarche: notification.marche_NOTIF_obj?.type_Marche,
        statutMarche: notification.marche_NOTIF_obj.statut,
        delaisGarantieMarche: notification.marche_NOTIF_obj.delaisGarantie,
        delaisMarche: notification.marche_NOTIF_obj.delaisMarche,
        montantFinalMarche: notification.marche_NOTIF_obj.montantFinal
      } : null;

      const data = {
        numOrdreNOTIF: notification.numOrdre_NOTIF,
        dateVisa_NOTIF: notification.dateVisa_NOTIF,
        dateApprobation_NOTIF: notification.dateApprobation_NOTIF,
        montantFinal: notification.marche_NOTIF_obj?.montantFinal,
        delaisMarche: notification.marche_NOTIF_obj?.delaisMarche,
        montantFinalLetters: numberToWords(notification.marche_NOTIF_obj?.montantFinal || 0),
        montantFinalNumeric: (notification.marche_NOTIF_obj?.montantFinal || 0).toLocaleString('fr-FR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
      };

      // Générer le document sécurisé avec le template sécurisé
      await SecureDocumentService.generateSecureDocument(
        '/templates/NotificationApprobation.docx',
        data,
        `NOTIFICATION_${notification.numOrdre_NOTIF}`
      );

    } catch (error) {
      // Gestion des erreurs sécurisées
      SecureDocumentService.handleSecurityError(error);
    }
  }
}