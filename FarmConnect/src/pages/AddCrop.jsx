import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import "../styles/dashboard.css";

const AddCrop = () => {
  const navigate = useNavigate();
  const [cropName, setCropName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(""); // This will hold the Base64 string

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [speechError, setSpeechError] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const recognitionRef = useRef(null);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSpeechSupported = typeof SpeechRecognition !== "undefined";

  // This function converts the image to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // The Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const buildFallbackImageUrl = (name) => {
    const query = encodeURIComponent((name || "fresh vegetables").trim());
    return `https://source.unsplash.com/featured/?${query}`;
  };

  const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const parseTamilNumber = (text) => {
    if (!text) return null;

    const normalized = text.toLowerCase();

    const unitsMap = {
      "பூஜ்யம்": 0,
      "சூனியம்": 0,
      "ஒரு": 1,
      "ஒன்று": 1,
      "இரண்டு": 2,
      "மூன்று": 3,
      "நான்கு": 4,
      "ஐந்து": 5,
      "ஆறு": 6,
      "ஏழு": 7,
      "எட்டு": 8,
      "ஒன்பது": 9,
    };

    const teensMap = {
      "பத்து": 10,
      "பதினொன்று": 11,
      "பன்னிரண்டு": 12,
      "பதிமூன்று": 13,
      "பதினான்கு": 14,
      "பதினைந்து": 15,
      "பதினாறு": 16,
      "பதினேழு": 17,
      "பதினெட்டு": 18,
      "பத்தொன்பது": 19,
    };

    const tensMap = {
      "இருபது": 20,
      "முப்பது": 30,
      "நாற்பது": 40,
      "ஐம்பது": 50,
      "அறுபது": 60,
      "எழுபது": 70,
      "எண்பது": 80,
      "தொண்ணூறு": 90,
    };

    const hundredCompounds = {
      "நூறு": 100,
      "நூற்று": 100,
      "நூற்ற": 100,
      "இருநூறு": 200,
      "முன்னூறு": 300,
      "மூன்றுநூறு": 300,
      "நானூறு": 400,
      "ஐநூறு": 500,
      "ஆறுநூறு": 600,
      "எழுநூறு": 700,
      "எண்ணூறு": 800,
      "ஒன்பதுநூறு": 900,
    };

    const thousandCompounds = {
      "ஆயிரம்": 1000,
      "ஆயிரத்து": 1000,
      "இரண்டாயிரம்": 2000,
      "மூன்றாயிரம்": 3000,
      "நான்காயிரம்": 4000,
      "ஐந்தாயிரம்": 5000,
      "ஆறாயிரம்": 6000,
      "ஏழாயிரம்": 7000,
      "எட்டாயிரம்": 8000,
      "ஒன்பதாயிரம்": 9000,
    };

    const tokens = [
      ...Object.keys(thousandCompounds),
      ...Object.keys(hundredCompounds),
      ...Object.keys(teensMap),
      ...Object.keys(tensMap),
      ...Object.keys(unitsMap),
    ]
      .sort((a, b) => b.length - a.length)
      .map(escapeRegex);

    const tokenRegex = new RegExp(tokens.join("|"), "g");
    const matches = normalized.match(tokenRegex) || [];

    if (!matches.length) return null;

    let total = 0;
    let current = 0;

    for (const token of matches) {
      if (thousandCompounds[token]) {
        const value = thousandCompounds[token];
        if (value === 1000) {
          const base = current || 1;
          total += base * 1000;
          current = 0;
        } else {
          total += value;
        }
        continue;
      }

      if (hundredCompounds[token]) {
        const value = hundredCompounds[token];
        if (value === 100) {
          const base = current || 1;
          total += base * 100;
          current = 0;
        } else {
          current += value;
        }
        continue;
      }

      if (teensMap[token]) {
        current += teensMap[token];
        continue;
      }

      if (tensMap[token]) {
        current += tensMap[token];
        continue;
      }

      if (Object.prototype.hasOwnProperty.call(unitsMap, token)) {
        current += unitsMap[token];
      }
    }

    return total + current || null;
  };

  const parseVoiceInput = (transcript) => {
    const lower = transcript.toLowerCase();
    const numbers = lower.replace(/,/g, "").match(/\d+(?:\.\d+)?/g) || [];

    const priceKeywords = ["price", "rupees", "rs", "₹", "விலை", "ரூபாய்", "ரூ"];
    const quantityKeywords = ["quantity", "qty", "kg", "kgs", "kilogram", "kilo", "அளவு", "கிலோ", "கிலோகிராம்", "கி.கி"];
    const descKeywords = ["description", "about", "details", "விவரம்", "விளக்கம்", "பற்றி"];
    const allKeywords = [...priceKeywords, ...quantityKeywords, ...descKeywords];

    const priceRegex = new RegExp(`(?:${priceKeywords.map(escapeRegex).join("|")})\\s*([\\d.]+)`, "i");
    const qtyRegex = new RegExp(`(?:${quantityKeywords.map(escapeRegex).join("|")})\\s*([\\d.]+)`, "i");

    const priceMatch = lower.match(priceRegex);
    const qtyMatch = lower.match(qtyRegex);

    let priceValue = priceMatch?.[1] || numbers[0];
    let quantityValue = qtyMatch?.[1] || numbers[1];

    const extractAfterKeyword = (keywords) => {
      const keywordRegex = new RegExp(`(?:${keywords.map(escapeRegex).join("|")})\\s*`, "i");
      const match = transcript.match(keywordRegex);
      if (!match) return "";
      const after = transcript.slice(match.index + match[0].length);
      const stopRegex = new RegExp(`(?:${allKeywords.map(escapeRegex).join("|")})`, "i");
      const stopIndex = after.search(stopRegex);
      return stopIndex >= 0 ? after.slice(0, stopIndex) : after;
    };

    if (!priceValue) {
      const priceText = extractAfterKeyword(priceKeywords);
      const tamilPrice = parseTamilNumber(priceText);
      if (tamilPrice) priceValue = tamilPrice.toString();
    }

    if (!quantityValue) {
      const quantityText = extractAfterKeyword(quantityKeywords);
      const tamilQuantity = parseTamilNumber(quantityText);
      if (tamilQuantity) quantityValue = tamilQuantity.toString();
    }

    if (priceValue) setPrice(priceValue);
    if (quantityValue) setQuantity(quantityValue);

    const descRegex = new RegExp(`(?:${descKeywords.map(escapeRegex).join("|")})\\s*(.*)$`, "i");
    const descMatch = transcript.match(descRegex);
    if (descMatch && descMatch[1]) {
      setDescription(descMatch[1].trim());
    }

    let namePart = transcript;
    const keywordRegex = new RegExp(`(?:${allKeywords.map(escapeRegex).join("|")})`, "i");
    const keywordIndex = lower.search(keywordRegex);
    const numberIndex = lower.search(/\d/);
    let cutIndex = -1;
    if (keywordIndex >= 0) cutIndex = keywordIndex;
    if (numberIndex >= 0 && (cutIndex === -1 || numberIndex < cutIndex)) cutIndex = numberIndex;
    if (cutIndex > 0) {
      namePart = transcript.slice(0, cutIndex);
    }
    namePart = namePart.replace(/[:\-]/g, " ").trim();
    if (namePart) {
      setCropName(namePart);
    }
  };

  const startVoiceInput = () => {
    if (!isSpeechSupported) {
      setSpeechError("Voice input is not supported in this browser.");
      return;
    }

    setSpeechError("");
    setVoiceStatus("");

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ta-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setVoiceStatus(`Heard: "${transcript}"`);
        parseVoiceInput(transcript);
      }
    };

    recognition.onerror = (event) => {
      setSpeechError(event.error || "Voice input failed. Please try again.");
    };

    recognition.onend = () => {
      setIsVoiceActive(false);
    };

    recognitionRef.current = recognition;
    setIsVoiceActive(true);
    recognition.start();
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsVoiceActive(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!cropName || !price || !quantity) {
      setError("Please fill crop name, price, and quantity.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("farmerToken");

      if (!token) {
        setError("You are not logged in as a farmer. Please login again.");
        setLoading(false);
        navigate("/login"); // Send to login
        return;
      }
      // ===================================================================

      const imageToUse = image || buildFallbackImageUrl(cropName);
      const descriptionToUse =
        description || `Fresh ${cropName} from local farms.`;

      // Create the data object for the API
      const newCropData = {
        cropName: cropName,
        description: descriptionToUse,
        price: price,
        quantity: quantity,
        image: imageToUse, // Base64 or fallback URL
        category: "Other",
        location: "Farm Location",
      };

      // Send the POST request with the token in the headers
      await api.post("/crops", newCropData, {
        headers: {
          Authorization: `Bearer ${token}`, // This proves you are a logged-in farmer
        },
      });

      setLoading(false);
      alert("Crop added successfully! It is now live and visible to consumers.");
      navigate("/my-crops");
    } catch (err) {
      setLoading(false);
      // This will show "Only farmers can add crops" if the token is wrong
      setError(err.response?.data?.message || "Failed to add crop. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Add New Crop</h2>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {speechError && <p style={{ color: "red", textAlign: "center" }}>{speechError}</p>}
      {voiceStatus && <p style={{ textAlign: "center" }}>{voiceStatus}</p>}

      <form className="add-crop-form" onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
          <button
            type="button"
            onClick={isVoiceActive ? stopVoiceInput : startVoiceInput}
            disabled={!isSpeechSupported}
            style={{ padding: "8px 12px" }}
          >
            {isVoiceActive ? "Stop Voice Input" : "Voice Input"}
          </button>
          <span style={{ fontSize: "0.9rem", color: "#555" }}>
            Say: "தக்காளி விலை ஐம்பது அளவு நூறு விவரம் புதியது"
          </span>
        </div>

        <label>
          Crop Name <span className="required">*</span>
        </label>
        <input
          type="text"
          value={cropName}
          onChange={(e) => setCropName(e.target.value)}
          placeholder="Enter crop name"
        />

        <label>Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        ></textarea>

        <label>
          Price per kg (₹) <span className="required">*</span>
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price (e.g., 40)"
        />

        <label>
          Quantity (kg) <span className="required">*</span>
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity (e.g., 500)"
        />

        <label>Upload Image (optional)</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {image && (
          <div className="preview">
            <p>Preview:</p>
            <img src={image} alt="Crop Preview" className="preview-image" />
          </div>
        )}

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Submitting..." : "Add Crop"}
        </button>
      </form>
    </div>
  );
};

export default AddCrop;
