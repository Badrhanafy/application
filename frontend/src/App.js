import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserForm from "./page/Ajouter/AjouterUser";
import Schools from "./page/afficher/schools";
import AddSchool from "./page/Ajouter/Addschool";
import SchoolDetails from "./page/afficher/school";
import Schoolprogress from "./page/schoolprogress";
import Login from "./page/login";
import AddAdmin from "./page/Ajouter/AddAdmin";
import SchoolImages from "./page/afficher/images";
import Imageschool from "./page/afficher/imsges";

import Rapport from "./Rapport";
import VisiteDetail from "./Visitedetails";
import Notfound from "./page/Notfound";
import { Alert } from "react-bootstrap";
import Alerttest from "./page/Testalerts";
import Social from "./page/Social";

const App = () => {
	return (
		<Router>
			
			<Routes>
				<Route path="/Schools" element={<Schools />} />
				<Route path="/Addschool" element={<AddSchool />} />
				<Route path="/school/:idecole" element={<SchoolDetails />} />
				<Route path="/TaskSelector/:idecole" element={<Schoolprogress />} />
				<Route path="/" element={<Login />} />
				<Route path="/AddAdmin" element={<AddAdmin />} />
				<Route path="/AjouterUser" element={<UserForm />} />
				<Route path="/SchoolImages" element={<SchoolImages />} />
				<Route path="Imageschool/:idecole/images" element={<Imageschool />} />
				<Route path="/Rapport" element={<Rapport />} />
				<Route path="/Visitedetails/:idvisite/:idecole" element={<VisiteDetail />} />
				<Route path='*' element={<Notfound/>} />
				<Route path='/Alerttest' element={<Alerttest/>} />
				<Route path='/social' element={<Social/>} />
				
			</Routes>
		</Router>
	);
};

export default App;
