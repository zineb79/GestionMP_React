import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import saveAs from 'file-saver';
import { AppelOffre } from './AOService';

interface TemplateErrorProperties {
  errors: Array<{
    properties: {
      placeholder: string;
    };
  }>;
}

import { Notification } from './NotificationService';
import { Marche } from './MarcheService';

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
      // Charger le template Word
      const response = await fetch('/templates/AppelOffre.docx');
      const buffer = await response.arrayBuffer();
      
      // Initialiser PizZip et Docxtemplater
      const zip = new PizZip(buffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Préparer les données pour le template
      const data = {
        numOrdreAO: appelOffre.num_Ordre_AO || '',
        dateOuverturePli_AO: appelOffre.dateOuverturePli_AO || '',
        heureOuverturePli_AO: appelOffre.heureOuverturePli_AO || '',
        typeAO: appelOffre.type_AO.toUpperCase() || '',
        idMarcheAO: appelOffre.marche?.id_Marche || '',
        objetAO: appelOffre.marche?.objet_marche || '',
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

      // Remplir le template
      try {
        doc.render(data);
      } catch (error) {
        const errorProperties = (error as any).properties as TemplateErrorProperties;
        if (errorProperties) {
          const placeholders = errorProperties.errors.map(e => e.properties.placeholder);
          console.error('Erreur de template:', errorProperties);
        }
        throw error;
      }

      // Générer le fichier Word
      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      // Sauvegarder le fichier
      saveAs(out, `appel_offre_${appelOffre.num_Ordre_AO}.docx`);
    } catch (error) {
      console.error('Erreur lors de la génération du document:', error);
      throw error;
    }
  }
//************************************ Notification **************************************** 
  static async generateNotificationDocument(notification: Notification): Promise<void> {
    try {
      // Charger le template Word pour les notifications
      const response = await fetch('/templates/NotificationApprobation.docx');
      const buffer = await response.arrayBuffer();
      
      // Initialiser PizZip et Docxtemplater
      const zip = new PizZip(buffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: function() {
          return '';
        }
      });

      // Préparer les données pour le template
      const marcheData = notification.marche_NOTIF_obj ? {
        numOrdreMarche: notification.marche_NOTIF_obj.numOrdre,
        objetMarche: notification.marche_NOTIF_obj.objet_marche,
        typeMarche: notification.marche_NOTIF_obj.type_Marche,
        statutMarche: notification.marche_NOTIF_obj.statut,
        delaisGarantieMarche: notification.marche_NOTIF_obj.delaisGarantie,
        delaisMarche: notification.marche_NOTIF_obj.delaisMarche,
        montantFinalMarche: notification.marche_NOTIF_obj.montantFinal
      } : null;

      const data = {
        numOrdreNotif: notification.numOrdre_NOTIF,
        dateVisaNotif: notification.dateVisa_NOTIF,
        dateApprobationNotif: notification.dateApprobation_NOTIF,
        marche: marcheData
      };

      try {
        // Remplir le template
        doc.render(data);
      } catch (error) {
        if (error instanceof Error && 'properties' in error) {
          const errorProperties = error as unknown as TemplateErrorProperties;
          if (errorProperties.errors) {
            const missingPlaceholders = errorProperties.errors.map(e => e.properties.placeholder);
            console.error('Placeholders manquants dans le template:', missingPlaceholders);
            throw new Error(`Erreur de template: Placeholders manquants - ${missingPlaceholders.join(', ')}`);
          }
        }
        throw error;
      }

      // Générer le fichier Word
      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-offecedocument.wordprocessingml.document'
      });

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(out);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Notification_${notification.numOrdre_NOTIF}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Erreur lors de la génération du document:', error);
      if (error instanceof Error && 'properties' in error) {
        const errorProperties = error as unknown as TemplateErrorProperties;
        console.error('Erreurs de template:', errorProperties.errors);
      }
      throw error;
    }
  }
}
