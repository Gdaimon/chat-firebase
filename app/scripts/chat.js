class Chat {

  constructor(roomKey, user, containerId, database) {
    this.user = user;
    this.id = roomKey;
    this.database = database;
    this.buildChat(containerId);
    this.setEvents();
  }

  buildChat(containerId) {
    $.tmpl($("#hidden-template"), {id: this.id})
      .appendTo("#" + containerId);

    this.ref = this.database.ref("/messages/" + this.id);
  }

  setEvents() {
    $("#" + this.id).find("form").on("submit", (ev) => {
      ev.preventDefault(); //Para que no se refersque el navegador
      var msg = $(ev.target).find(".mensaje").val();
      this.send(msg);

      return false;

    });
    //Adiciona los mensajes en los campos de texto
    this.ref.on("child_added", (data)=>this.add(data));
  }


  add(data) {
    var mensaje = data.val();
    var html = `
<div class="chip">
<img src="${this.user.photoURL}" alt="test">
                  ${mensaje.name}:                  
                  </div>
                  <span>${mensaje.msg}</span>
                `
    var $li = $("<li>").addClass("collection-item")
      .html(html)
    $("#" + this.id).find(".messages").append($li);

  }


  send(msg) {
    console.log(this.user);
    this.ref.push({
      name: this.user.displayName || this.user.email,
      roomId: this.id,
      msg: msg
    });
    $('.mensaje').val('');
  }


}
