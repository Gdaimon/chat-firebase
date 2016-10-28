(function () {

  "use strict";

  var config = {
    apiKey: "AIzaSyBA0kxu30fvJelmiyAarKx39GhzsnPAcsE",
    authDomain: "chat-distribuidos.firebaseapp.com",
    databaseURL: "https://chat-distribuidos.firebaseio.com",
    storageBucket: "chat-distribuidos.appspot.com",
    messagingSenderId: "683107021379"
  };
  firebase.initializeApp(config);


  var db = firebase.database(); //variable database
  var loginBtn = document.getElementById('start-login');
  var user = null;
  var userConectados = null;
  var conectadoKey = "";
  var rooms;

  loginBtn.addEventListener("click", googleLogin);//Evento
  window.addEventListener("unload", unlogin);//cierra el navegador

  /**
   * Funcion de Autenticación
   */
  function googleLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(function (result) {
        user = result.user;
        $("#login").fadeOut();
        initApp();
      })
  }


  /**
   * Inicia la Aplicacion solamente si ya se logeo
   */
  function initApp() {
    //Referencia de la database
    userConectados = db.ref("/connected");
    rooms = db.ref("/rooms");

    // uid --> identificador unico
    // user.displayName --> nombre usuario registrado en la cuenta
    login(user.uid, user.displayName || user.email);


    userConectados.on("child_added", addUser);
    userConectados.on("child_removed", removeUser);

    rooms.on("child_added", newRoom);

  }

  /**
   * Guardamos los Usuarios logeados
   * @param uid
   * @param name
   */
  function login(uid, name) {
    var conectado = userConectados.push({
      uid: uid,
      name: name
    });
    console.log(conectado);
    conectadoKey = conectado.key;
  }

  /**
   * Borra los usuarios conectados en la db
   */
  function unlogin() {
    db.ref("/connected/" + conectadoKey).remove();
  }

  function addUser(data) {
    if (data.val().uid == user.uid) return
    var friend_id = data.val().uid;
    var $li = $("<li>").addClass("collection-item")
      .html(data.val().name)
      .attr("id", friend_id)
      .appendTo("#users");

    $li.on("click", function () {
      var room = rooms.push({
        creator: user.uid,
        friend: friend_id
      });
      // new Chat(room.key, user, "chats", db);
    })
  }

  function removeUser(data) {
    $("#" + data.val().uid).slideUp("fast", function () {
      $(this).remove();
    })
  }

  function newRoom(data) {
    if (data.val().friend == user.uid) {

      new Chat(data.key, user, "chats", db);
    }

    if (data.val().creator == user.uid) {

      new Chat(data.key, user, "chats", db);
    }
  }


})();
