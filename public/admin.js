(function () {
  "use strict";

  var countInput = document.getElementById("memberCount");
  var list = document.getElementById("membersList");
  if (!countInput || !list) return;

  function buildMemberBlock(index) {
    var block = document.createElement("div");
    block.className = "member-block";
    block.dataset.index = index;

    var num = document.createElement("span");
    num.className = "member-num";
    num.textContent = "Member " + (index + 1);

    var userField = document.createElement("div");
    userField.className = "field";
    var userLabel = document.createElement("label");
    userLabel.setAttribute("for", "memberUsername_" + index);
    userLabel.textContent = "Username";
    var userInput = document.createElement("input");
    userInput.type = "text";
    userInput.id = "memberUsername_" + index;
    userInput.name = "memberUsername";
    userInput.required = true;
    userInput.maxLength = 30;
    userInput.autocomplete = "off";
    userInput.spellcheck = false;
    userInput.placeholder = "member username";
    userField.appendChild(userLabel);
    userField.appendChild(userInput);

    var passField = document.createElement("div");
    passField.className = "field";
    var passLabel = document.createElement("label");
    passLabel.setAttribute("for", "memberPassword_" + index);
    passLabel.textContent = "Password";
    var passInput = document.createElement("input");
    passInput.type = "password";
    passInput.id = "memberPassword_" + index;
    passInput.name = "memberPassword";
    passInput.required = true;
    passInput.minLength = 4;
    passInput.maxLength = 64;
    passInput.autocomplete = "new-password";
    passInput.placeholder = "member password";
    passField.appendChild(passLabel);
    passField.appendChild(passInput);

    block.appendChild(num);
    block.appendChild(userField);
    block.appendChild(passField);
    return block;
  }

  function reconstitutePreserved(existing) {
    var preserved = new Map();
    existing.forEach(function (block) {
      var i = Number(block.dataset.index);
      if (!Number.isFinite(i)) return;
      preserved.set(i, {
        u: block.querySelector('[name="memberUsername"]').value,
        p: block.querySelector('[name="memberPassword"]').value,
      });
    });
    return preserved;
  }

  function render() {
    var desired = Math.max(1, Math.min(20, parseInt(countInput.value, 10) || 1));
    var preserved = reconstitutePreserved(list.querySelectorAll(".member-block"));

    list.innerHTML = "";
    for (var i = 0; i < desired; i++) {
      var block = buildMemberBlock(i);
      var saved = preserved.get(i);
      if (saved) {
        block.querySelector('[name="memberUsername"]').value = saved.u;
        block.querySelector('[name="memberPassword"]').value = saved.p;
      }
      list.appendChild(block);
    }
  }

  countInput.addEventListener("input", render);
  countInput.addEventListener("change", render);
  render();
})();