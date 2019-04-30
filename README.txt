-- READ ME --

Application multitiers - Mysticat

Pr�requis
---------

 - Avoir Git sur la machine, url: https://git-scm.com/downloads

 - Avoir Java d'install� sur la machine, url: https://java.com/fr/download/

 - Avoir NodeJs d'install� sur la machine, url: https://nodejs.org/en/download/

 - Avoir STS (Spring Tool Suite), url: https://spring.io/tools/sts/all

 - Avoir une instance d'un serveur AWS (seulement pour l'installation serveur)

 - Avoir Maven d'install� sur la machine, url: https://maven.apache.org/download.cgi

Premi�re �tape
--------------

 - Forker le repo du projet.
   url: https://github.com/mabechard/mysticat

 - Cloner le projet sur votre instance (git clone)


Premi�re mani�re d'�x�cuter le programme (local)
------------------------------------------------

 - S'assurer que le port dans le fichier application.properties et dans Constantes.js
   doivent �tre le m�me 

 - Pour lancer le serveur d'API, faire un run sur le fichier ProjetMultitiersApplication.java
   dans le package com.multitiers du dossier source src/main/java

 - Avant de lancer le service web, ouvir un terminal � la racine du projet et ex�cuter npm i
 
 - Pour lancer le service web, ex�cuter npm start

 - Ouvrir un navigateur

 - Aller sur l'addresse suivante : localhost:3000


Deuxi�me mani�re d'�x�cuter le programme (local)
------------------------------------------------

 - Dans un terminal � la racine du projet, �x�cutez npm run build

 - Copiez les fichiers du dossier build vers le dossier src/main/resources/static

 - Pour lancer le serveur d'API, faire un run sur le fichier ProjetMultitiersApplication.java
   dans le package com.multitiers du dossier source src/main/java

 - Ouvrir un navigateur

 - Aller sur l'addresse suivante : localhost avec le port �crit dans le fichier 
   application.properties


Troisi�me mani�re d'�x�cuter le programme (serveur)
---------------------------------------------------

 - R�p�ter les �tapes de la deuxi�me mani�re sauf pour le d�marrage de l'application

 - Dans un terminal � la racine du projet, �x�cutez mvn clean package

 - Envoyer le fichier .jar g�n�r� du projet (par la commande pr�c�dente) se trouvant dans le
   dossier target du projet avec par exemple, une commande comme scp.

 - Se connecter sur son instance AWS

 - �x�cuter le fichier .jar du projet avec la commande: sudo nohup java -jar <nom du fichier .jar> & 

 - Ouvrir un navigateur

 - Aller sur l'addresse suivante : <addresse AWS> avec le port �crit dans le fichier 
   application.properties lors du packaging







