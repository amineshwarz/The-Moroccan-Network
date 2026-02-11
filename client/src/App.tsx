import { useEffect, useState } from 'react'
import axios from 'axios'


function App() {
  
  const API_URL = import.meta.env.VITE_API_URL;
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Appel vers l'URL de Symfony
    axios.get(`${API_URL}/hello`)
      .then(response => {
        setMessage(response.data.message)
      })
      .catch(error => {
        console.error("Erreur lors de l'appel API", error)
      })
  }, [])

  return (
    <div>
      <h1>Test de connexion</h1>
      <h2>Réponse du serveur : {message ? message : "Chargement..."}</h2>
    </div>
  )
}

export default App

// import React from 'react';
// import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Layouts
// import { PublicLayout } from './components/layouts/PublicLayout';
// import { AdminLayout } from './components/layouts/AdminLayout'

// // Pages Publiques
// import { Home } from './pages/visitor/Home';
// import { Subscribe } from './pages/visitor/Subscribe';

// // Pages Admin
// import { Dashboard } from './pages/admin/Dashboard';
// import { UserRoles } from './pages/admin/UserRoles';

// const App: React.FC = () => {
//   return (
//     <Router>
//       <Routes>
//         {/* Routes Publiques (Site Vitrine) */}
//         <Route path="/" element={<PublicLayout />}>
//           <Route index element={<Home />} />
//           <Route path="adhesion" element={<Subscribe />} />
//           {/* Tu pourras ajouter ici : <Route path="contact" element={<Contact />} /> */}
//         </Route>

//         {/* Routes Backoffice (Administration) */}
//         <Route path="/admin" element={<AdminLayout />}>
//           <Route index element={<Dashboard />} />
//           <Route path="roles" element={<UserRoles />} />
//         </Route>

//         {/* Redirection par défaut pour les routes inconnues */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;