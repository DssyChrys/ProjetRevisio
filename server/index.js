const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const axios = require('axios');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const UserRoute = require("./Routes/UserRoute");
app.use('/api/User', UserRoute);

const uri = process.env.ATLAS_URI;
const hfApiKey = process.env.HF_API_KEY;


const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));


app.get('/', (req, res) => {
  res.send('Bienvenue sur la page accueil');
});


mongoose.connect(uri)
  .then(() => console.log("Connexion à MongoDB établie"))
  .catch((error) => console.log("Échec de connexion à MongoDB :", error.message));


  const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Filtrer pour accepter uniquement les fichiers PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF sont autorisés'), false);
  }
};
const upload = multer({ storage, fileFilter });

// Fonction pour générer un résumé structuré et colorier les informations importantes
async function generateSummary(text) {
    const maxLength = 1000; // Diviser en morceaux de 1000 tokens ou caractères
    const chunkSize = maxLength - 50; // Réduire un peu pour éviter les erreurs de dépassement de limite
  
    // Diviser le texte en morceaux plus petits
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, i + chunkSize));
    }
  
    // Stocker tous les résumés générés
    let fullSummary = '';
  
    // Fonction pour appliquer des couleurs
    const highlightImportantInfo = (text) => {
      // Exemple : mettre en surbrillance les mots "important" et "clé"
      const highlightedText = text.replace(/\b(important|clé|essentiel)\b/gi, (match) => {
        return `<span style="color: red; font-weight: bold;">${match}</span>`;
      });
      return highlightedText;
    };
  
    // Fonction de réessai en cas d'échec de l'API Hugging Face
    const retry = async (chunk) => {
      let retries = 5;
      let lastError = null;
  
      while (retries > 0) {
        try {
          const response = await axios.post('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
            inputs: chunk,
            parameters: {
              max_length: 150, // Ajustez la longueur du résumé comme nécessaire
            },
          }, {
            headers: {
              'Authorization': `Bearer ${hfApiKey}`,
              'Content-Type': 'application/json',
            },
          });
  
          return response.data[0]?.summary_text || '';
        } catch (error) {
          if (error.response?.data?.error === 'Model is currently loading') {
            console.log('Le modèle est en train de se charger. Nouvelle tentative dans 10 secondes...');
            await new Promise(resolve => setTimeout(resolve, 10000)); // Attendre 10 secondes avant de réessayer
            retries--;
          } else {
            lastError = error;
            break;
          }
        }
      }
  
      return lastError ? `Une erreur est survenue : ${lastError.message}` : 'Résumé non généré.';
    };
  
    // Traitement de chaque morceau de texte
    for (const chunk of chunks) {
      const summary = await retry(chunk);
      fullSummary += highlightImportantInfo(summary);
    }
  
    // Retourner le résumé global
    return fullSummary || 'Résumé non généré.';
  }


// Endpoint pour l'upload de PDF
app.post('/api/User/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier PDF téléchargé.' });
    }

    const pdfPath = req.file.path;
    const pdfBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(pdfBuffer);
    const text = data.text.trim();

    console.log('Texte extrait du PDF:', text.substring(0, 200)); // Log du texte extrait (pour les premiers 200 caractères)

    // Utilisation de Hugging Face pour générer un résumé en français
    const summary = await generateSummary(text);

    fs.unlinkSync(pdfPath);  // Supprimer le fichier après traitement
    res.json({ summary: summary });
  } catch (error) {
    console.error("Erreur lors du traitement du fichier PDF :", error);
    res.status(500).json({ error: 'Erreur lors du traitement du PDF.' });
  }
});

app.listen(3001, () => {
  console.log("Serveur en écoute sur le port 3001");
});