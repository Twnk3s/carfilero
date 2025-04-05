// src/components/Cars/CarForm.js
import React, { useState, useEffect } from 'react';
import InputField from '../Shared/InputField';
import SelectField from '../Shared/SelectField';
import TextAreaField from '../Shared/TextAreaField';
import Button from '../Shared/Button';
import LoadingSpinner from '../Shared/LoadingSpinner';

// Opțiuni statice pentru select-uri
const motorizareOptions = [
  { value: 'benzina', label: 'Benzină' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hibrid', label: 'Hibrid' },
  { value: 'electric', label: 'Electric' },
  { value: 'gpl', label: 'GPL' },
  { value: 'altele', label: 'Altele' },
];

const cutieVitezeOptions = [
  { value: 'manuala', label: 'Manuală' },
  { value: 'automata', label: 'Automată' },
];

/**
 * Formular pentru adăugarea sau editarea datelor unei mașini.
 *
 * @param {object|null} initialData - Datele mașinii pentru modul editare, sau null pentru modul adăugare.
 * @param {function} onSave - Funcția apelată la salvare. Primește datele formularului.
 * @param {function} onCancel - Funcția apelată la anulare/închidere.
 * @param {boolean} [isSaving=false] - Prop pentru a indica dacă o operațiune de salvare este în desfășurare (afișează spinner).
 */
const CarForm = ({ initialData, onSave, onCancel, isSaving = false }) => {
  // Starea locală pentru datele formularului
  const [formData, setFormData] = useState({
    // Date Generale
    marca: '',
    model: '',
    numarInmatriculare: '',
    anFabricatie: '', // Poate fi 'number' sau 'string'
    motorizare: '',
    cutieViteze: '',
    kilometrajActual: '', // Poate fi 'number' sau 'string'
    imageUrl: '',
    // Documente
    dataITP: '',
    dataRCA: '',
    dataCASCO: '', // Opțional
    dataUltimaRevizie: '',
    dataUrmatoareiRevizii: '',
    // Cheltuieli Estimate (Opțional)
    costITP: '',
    costRCA: '',
    costRevizie: '',
    alteCosturi: '',
    // Istoric Tehnic
    istoricTehnic: '',
  });

  // Stare locală pentru erori de validare
  const [errors, setErrors] = useState({});

  // Efect pentru a popula formularul cu datele inițiale în modul Editare
  useEffect(() => {
    if (initialData) {
      console.log("CarForm: Populating with initial data:", initialData);
      // Asigurăm că toate câmpurile așteptate sunt prezente, chiar dacă sunt goale
      setFormData({
        marca: initialData.marca || '',
        model: initialData.model || '',
        numarInmatriculare: initialData.numarInmatriculare || '',
        anFabricatie: initialData.anFabricatie || '',
        motorizare: initialData.motorizare || '',
        cutieViteze: initialData.cutieViteze || '',
        // Convertim numerele în string pentru input-uri, dacă e cazul (sau folosim type="number")
        kilometrajActual: initialData.kilometrajActual?.toString() ?? '',
        imageUrl: initialData.imageUrl || '',
        // Convertim Timestamp-urile Firebase în format 'yyyy-MM-dd' pentru input type="date"
        dataITP: initialData.dataITP?.toDate ? initialData.dataITP.toDate().toISOString().split('T')[0] : initialData.dataITP || '',
        dataRCA: initialData.dataRCA?.toDate ? initialData.dataRCA.toDate().toISOString().split('T')[0] : initialData.dataRCA || '',
        dataCASCO: initialData.dataCASCO?.toDate ? initialData.dataCASCO.toDate().toISOString().split('T')[0] : initialData.dataCASCO || '',
        dataUltimaRevizie: initialData.dataUltimaRevizie?.toDate ? initialData.dataUltimaRevizie.toDate().toISOString().split('T')[0] : initialData.dataUltimaRevizie || '',
        dataUrmatoareiRevizii: initialData.dataUrmatoareiRevizii?.toDate ? initialData.dataUrmatoareiRevizii.toDate().toISOString().split('T')[0] : initialData.dataUrmatoareiRevizii || '',
        costITP: initialData.costITP?.toString() ?? '',
        costRCA: initialData.costRCA?.toString() ?? '',
        costRevizie: initialData.costRevizie?.toString() ?? '',
        alteCosturi: initialData.alteCosturi?.toString() ?? '',
        istoricTehnic: initialData.istoricTehnic || '',
      });
    } else {
      // Mod Adăugare: Resetează formularul la valorile default (deja făcute de useState)
       console.log("CarForm: Initializing in Add mode.");
    }
    // Resetăm erorile la schimbarea modului (Add/Edit)
    setErrors({});
  }, [initialData]); // Re-rulează doar când `initialData` se schimbă

  // Handler generic pentru actualizarea stării formData
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Tratament special pentru numere (poate necesita ajustare)
    let processedValue = value;
    if (type === 'number' || name === 'anFabricatie' || name === 'kilometrajActual' || name.startsWith('cost') || name === 'alteCosturi') {
         // Permite golirea câmpului sau păstrează ca string pentru validare flexibilă
         // Conversia finală în număr se va face înainte de salvare
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: processedValue
    }));

    // Opțional: Șterge eroarea pentru câmpul modificat
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  // --- Funcția de Validare (Simplă) ---
  const validateForm = () => {
    const newErrors = {};
    // Câmpuri obligatorii simple
    if (!formData.marca.trim()) newErrors.marca = 'Marca este obligatorie.';
    if (!formData.model.trim()) newErrors.model = 'Modelul este obligatoriu.';
    if (!formData.numarInmatriculare.trim()) newErrors.numarInmatriculare = 'Numărul de înmatriculare este obligatoriu.';
    else if (!/^[A-Z]{1,2}[0-9]{2,3}[A-Z]{3}$/i.test(formData.numarInmatriculare.replace(/\s+/g, ''))) {
        newErrors.numarInmatriculare = 'Format număr înmatriculare invalid (ex: B123ABC).';
    }

    if (!formData.anFabricatie) newErrors.anFabricatie = 'Anul fabricației este obligatoriu.';
    else if (!/^\d{4}$/.test(formData.anFabricatie) || parseInt(formData.anFabricatie) < 1900 || parseInt(formData.anFabricatie) > new Date().getFullYear() + 1 ) {
        newErrors.anFabricatie = 'Anul trebuie să fie valid (ex: 2023).';
    }

    if (!formData.kilometrajActual) newErrors.kilometrajActual = 'Kilometrajul este obligatoriu.';
    else if (isNaN(Number(formData.kilometrajActual)) || Number(formData.kilometrajActual) < 0) {
        newErrors.kilometrajActual = 'Kilometrajul trebuie să fie un număr pozitiv.';
    }

    // Validare simplă pentru date (doar dacă sunt introduse)
    // O validare mai complexă ar verifica și ordinea datelor (ex: data ITP > azi)
    // const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    // if (formData.dataITP && !dateFormatRegex.test(formData.dataITP)) newErrors.dataITP = 'Format dată invalid (YYYY-MM-DD).';
    // if (formData.dataRCA && !dateFormatRegex.test(formData.dataRCA)) newErrors.dataRCA = 'Format dată invalid (YYYY-MM-DD).';
    // ... similar pentru alte date ...

    // Validare pentru costuri (doar dacă sunt introduse, să fie numere)
    if (formData.costITP && (isNaN(Number(formData.costITP)) || Number(formData.costITP) < 0)) newErrors.costITP = 'Costul trebuie să fie un număr pozitiv.';
    if (formData.costRCA && (isNaN(Number(formData.costRCA)) || Number(formData.costRCA) < 0)) newErrors.costRCA = 'Costul trebuie să fie un număr pozitiv.';
    // ... similar pentru alte costuri ...

    setErrors(newErrors);
    // Returnează true dacă nu există erori (obiectul newErrors este gol)
    return Object.keys(newErrors).length === 0;
  };

  // --- Handler pentru Submit Formular ---
  const handleSubmit = (e) => {
    e.preventDefault(); // Previne reîncărcarea paginii
    console.log("CarForm: Submit attempted. Data:", formData);

    if (validateForm()) {
      console.log("CarForm: Validation successful.");
      // Pregătește datele pentru salvare (conversii necesare)
      const dataToSave = {
        ...formData,
        // Convertim înapoi în numere unde este cazul
        anFabricatie: parseInt(formData.anFabricatie, 10),
        kilometrajActual: parseInt(formData.kilometrajActual, 10),
        // Convertim costurile în numere (sau null/undefined dacă sunt goale)
        costITP: formData.costITP ? parseFloat(formData.costITP) : null,
        costRCA: formData.costRCA ? parseFloat(formData.costRCA) : null,
        costRevizie: formData.costRevizie ? parseFloat(formData.costRevizie) : null,
        alteCosturi: formData.alteCosturi ? parseFloat(formData.alteCosturi) : null,
         // Convertim string-urile de date YYYY-MM-DD înapoi în obiecte Timestamp Firebase
         // Firestore va gestiona stocarea corectă. Trimitem string-urile dacă input type="date" este folosit.
         // Dacă nu folosim input type="date", am trimite obiecte Date.
         // Pentru simplitate cu input type="date", trimitem string-ul și lăsăm Firestore să interpreteze.
         // ATENȚIE: Firestore poate interpreta YYYY-MM-DD ca fiind la miezul nopții UTC.
         // Dacă fusul orar e important, conversia trebuie făcută mai atent sau stocat ca string.
         // dataITP: formData.dataITP ? Timestamp.fromDate(new Date(formData.dataITP)) : null, // Exemplu conversie explicită
         dataITP: formData.dataITP || null, // Trimitem string-ul din input type="date"
         dataRCA: formData.dataRCA || null,
         dataCASCO: formData.dataCASCO || null,
         dataUltimaRevizie: formData.dataUltimaRevizie || null,
         dataUrmatoareiRevizii: formData.dataUrmatoareiRevizii || null,
      };

      // Elimina câmpurile goale opționale dacă preferi să nu fie stocate ca null în Firestore
       Object.keys(dataToSave).forEach(key => {
         if (dataToSave[key] === null || dataToSave[key] === '') {
           // Decide dacă vrei să le ștergi sau să le lași null/''
           // delete dataToSave[key];
         }
       });

      console.log("CarForm: Calling onSave with processed data:", dataToSave);
      onSave(dataToSave); // Apelează funcția de salvare pasată ca prop
    } else {
      console.warn("CarForm: Validation failed.", errors);
      // Scroll la primul câmp cu eroare (opțional, necesită refs)
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate> {/* noValidate dezactivează validarea HTML5 implicită */}
      {/* --- Secțiunea Date Generale --- */}
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 border-b pb-2">Date Generale</h3>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <InputField
          label="Marcă" id="marca" name="marca"
          value={formData.marca} onChange={handleChange}
          required error={errors.marca}
        />
        <InputField
          label="Model" id="model" name="model"
          value={formData.model} onChange={handleChange}
          required error={errors.model}
        />
        <InputField
          label="Număr Înmatriculare" id="numarInmatriculare" name="numarInmatriculare"
          value={formData.numarInmatriculare} onChange={handleChange}
          placeholder="Ex: B123ABC" required error={errors.numarInmatriculare}
          inputProps={{ maxLength: 7, style: { textTransform: 'uppercase' } }} // Adaugă maxLength și uppercase
        />
        <InputField
          label="An Fabricație" id="anFabricatie" name="anFabricatie"
          type="number" // Folosim type="number" pentru validare numerică de bază
          value={formData.anFabricatie} onChange={handleChange}
          placeholder="Ex: 2023" required error={errors.anFabricatie}
          inputProps={{ min: "1900", max: new Date().getFullYear() + 1, step: "1" }} // Atribute specifice type="number"
        />
         <SelectField
          label="Motorizare" id="motorizare" name="motorizare"
          value={formData.motorizare} onChange={handleChange}
          options={motorizareOptions} error={errors.motorizare}
        />
         <SelectField
          label="Cutie de Viteze" id="cutieViteze" name="cutieViteze"
          value={formData.cutieViteze} onChange={handleChange}
          options={cutieVitezeOptions} error={errors.cutieViteze}
        />
         <InputField
          label="Kilometraj Actual" id="kilometrajActual" name="kilometrajActual"
          type="number" // Folosim type="number"
          value={formData.kilometrajActual} onChange={handleChange}
          placeholder="Ex: 150000" required error={errors.kilometrajActual}
          inputProps={{ min: "0", step: "1" }}
        />
         <InputField
          label="Link Poză Mașină (URL)" id="imageUrl" name="imageUrl" type="url"
          value={formData.imageUrl} onChange={handleChange}
          placeholder="https://..." error={errors.imageUrl}
          // TODO (Post-MVP): Implementează upload real imagine
        />
      </div>

      {/* --- Secțiunea Documente --- */}
      <h3 className="text-lg font-medium leading-6 text-gray-900 mt-8 mb-4 border-b pb-2">Documente și Revizii</h3>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <InputField label="Data Expirare ITP" id="dataITP" name="dataITP" type="date" value={formData.dataITP} onChange={handleChange} error={errors.dataITP} inputClassName="appearance-none"/>
          <InputField label="Data Expirare RCA" id="dataRCA" name="dataRCA" type="date" value={formData.dataRCA} onChange={handleChange} error={errors.dataRCA} inputClassName="appearance-none"/>
          <InputField label="Data Expirare CASCO (Opțional)" id="dataCASCO" name="dataCASCO" type="date" value={formData.dataCASCO} onChange={handleChange} error={errors.dataCASCO} inputClassName="appearance-none"/>
          <InputField label="Data Ultimei Revizii" id="dataUltimaRevizie" name="dataUltimaRevizie" type="date" value={formData.dataUltimaRevizie} onChange={handleChange} error={errors.dataUltimaRevizie} inputClassName="appearance-none"/>
          <InputField label="Data Următoarei Revizii" id="dataUrmatoareiRevizii" name="dataUrmatoareiRevizii" type="date" value={formData.dataUrmatoareiRevizii} onChange={handleChange} error={errors.dataUrmatoareiRevizii} inputClassName="appearance-none"/>
      </div>

      {/* --- Secțiunea Cheltuieli Estimate (Opțional) --- */}
      <h3 className="text-lg font-medium leading-6 text-gray-900 mt-8 mb-4 border-b pb-2">Cheltuieli Anuale Estimate (Opțional)</h3>
       <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <InputField label="Cost Estimativ ITP (RON)" id="costITP" name="costITP" type="number" value={formData.costITP} onChange={handleChange} error={errors.costITP} inputProps={{ min: "0", step: "0.01" }}/>
          <InputField label="Cost Estimativ RCA (RON)" id="costRCA" name="costRCA" type="number" value={formData.costRCA} onChange={handleChange} error={errors.costRCA} inputProps={{ min: "0", step: "0.01" }}/>
          <InputField label="Cost Estimativ Revizie (RON)" id="costRevizie" name="costRevizie" type="number" value={formData.costRevizie} onChange={handleChange} error={errors.costRevizie} inputProps={{ min: "0", step: "0.01" }}/>
          <InputField label="Alte Costuri Estimate (RON)" id="alteCosturi" name="alteCosturi" type="number" value={formData.alteCosturi} onChange={handleChange} error={errors.alteCosturi} inputProps={{ min: "0", step: "0.01" }}/>
       </div>

      {/* --- Secțiunea Istoric Tehnic --- */}
       <h3 className="text-lg font-medium leading-6 text-gray-900 mt-8 mb-4 border-b pb-2">Istoric Tehnic / Note</h3>
       <TextAreaField
          label="Adaugă note despre intervenții, piese schimbate etc."
          id="istoricTehnic" name="istoricTehnic"
          value={formData.istoricTehnic} onChange={handleChange}
          rows={5} placeholder="Ex: Schimbat distribuția la 120.000 km în 2022..."
          error={errors.istoricTehnic}
        />

      {/* --- Butoane Acțiune Formular --- */}
      <div className="mt-8 pt-5 border-t border-gray-200">
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Anulează
          </Button>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {/* Afișează spinner dacă se salvează */}
            {isSaving && <LoadingSpinner size="w-4 h-4 mr-2 border-t-white" />}
            {/* Text diferit pentru Add/Edit */}
            {initialData ? 'Actualizează Mașina' : 'Adaugă Mașina'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CarForm;