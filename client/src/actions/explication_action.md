c'est là où tous nos fichiers d'actions iront et c'est là que nous faisons des demandes http et d'autres truc
le fichier qui existe dans ce dossier types.js : qui va contenir tous nos constantes
et aussi alert.js : où on va importer les types d'erreurs depuis types.js

// A propos du redux : donc on a connecté component/auth/register avec redux pour pouvoir enfin utiliser
une action setAlert() qui est définit sur /actions/alert donc a chaque fois que nous appelons cette action,
il va passer par /reducers/alert pour enregistrer dans un tableau de state-alert.payload
et puis il on l'envoyera a layout/alert,
donc on a envoyé une alerte qui correspond a un state,
et puis on va l'afficher a travers ce composant /layout/alert
Alors a chaque nouvelle action qui viennent du /reducers/alert on va l'afficher a travers /layout/alert
donc on aura besoin de se connecter a redux a chaque fois qu'on obtient un state ou qu'en envoie une alerte
et puis on a fait un setup pour que l'alerte disparait dans 5s qui se trouve dans /actions/alert un utlisant REMOVE_ALERT comme type et id comme payload et puis en l'envoyant vers reducers/alert pour on execute state.filter(alert) telque alert doit respecter la condition que alert.id!==payload


A propos de l'action /action/auth.js, la première de chose est de créer un reducer pour authentification /reducers/auth.js donc ce se traduit en creant un cas de register_success et un cas de register_fail, pour le premier cas lorsque l'utilisateur veut faire un register et en cas de success on doit prendre le token generé qui se trouve dans le payload de l'action (aciton.payload) est l'enregistré localement et puis retourner  une propagation du state (...state) et le payload et verifier que isAuthenticated is true and loading false car l'utilisateur a bien été enregistrer, passant en deuxième cas, là où l'echec de register ! on doit supprimer le token de localstorage, est retourner state, rendre le token:null (or ce qu'on fait dans l'initial state : est d'enregister localement un token, c'est ôur cela qu'on le rend null !!) puis isAuthenticated :true et aussi loading:true, donc ca sera notre reducteur pour l'authentification !!! et puis on va passer pour réaliser l'action de ce reducer dans action/auth.js 


