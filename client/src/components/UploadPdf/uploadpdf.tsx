import React, { useState } from "react";
import axios from "axios";
import { FiFileText } from "react-icons/fi"; // Icône PDF

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);  // Lien de téléchargement
  const [error, setError] = useState<string | null>(null); // État pour les erreurs

  // Fonction pour gérer le changement de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);

      // Si le fichier est une image, on crée un aperçu de l'image
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile); // Pour les images
      } else {
        setFilePreview(null); // Si ce n'est pas une image, on ne montre pas d'aperçu
      }
    }
  };

  // Fonction pour envoyer le fichier au back-end
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      console.error("No file selected");
      return;
    }

    // Crée un FormData pour envoyer le fichier en POST
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      // Envoi du fichier au back-end
      const response = await axios.post("http://localhost:3001/api/User/upload-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // Important pour recevoir un fichier
      });
      console.log("Fichier envoyé avec succès", response.data);

      // Crée un lien pour télécharger le fichier généré
      const fileBlob = new Blob([response.data], { type: "text/plain" });
      const downloadUrl = URL.createObjectURL(fileBlob);

      // Mettre à jour l'état pour le lien de téléchargement
      setDownloadLink(downloadUrl);

      setError(null); // Réinitialiser l'erreur si le résumé est généré correctement
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier", error);
      setError("Une erreur s'est produite lors de l'envoi du fichier.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center mx-2 py-30">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6">
        <label
          htmlFor="file-upload"
          className="block w-full text-center p-6 border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:bg-gray-50 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="text-gray-600">Cliquez pour télécharger un PDF</span>
          <input
            type="file"
            id="file-upload"
            accept=".pdf,image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Aperçu du fichier PDF */}
        {file && file.type === "application/pdf" && (
          <div className="mt-4 text-center">
            <FiFileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <span className="text-gray-600">{fileName}</span>
          </div>
        )}

        {/* Aperçu d'une image si le fichier est une image */}
        {filePreview && (
          <div className="mt-4">
            <img
              src={filePreview}
              alt="Aperçu"
              className="w-full h-auto rounded-md"
            />
          </div>
        )}

        {/* Affichage du nom du fichier */}
        {!filePreview && !file && (
          <div className="mt-4 text-center text-gray-600">
            <span>{fileName}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          Générer
        </button>

        {/* Afficher le lien de téléchargement */}
        {downloadLink && (
          <div className="mt-6">
            <a
              href={downloadLink}
              download="summary.txt"
              className="block text-center py-2 px-4 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none"
            >
              Télécharger le résumé
            </a>
          </div>
        )}

        {/* Afficher un message d'erreur si nécessaire */}
        {error && (
          <div className="mt-6 bg-red-100 p-4 rounded-md shadow-md text-red-600">
            <h2 className="font-bold text-xl">Erreur :</h2>
            <p className="mt-2">{error}</p>
          </div>
        )}
      </div>
    </form>
  );
}
