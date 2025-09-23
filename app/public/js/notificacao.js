// Dados de exemplo — depois substitua por fetch ao backend
const notifications = [
    {
      id: "n1",
      title: "Seu vídeo 'inteligência artificial' teve sua 1ª curtida.",
      date: "2025-07-04T05:23:00",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=60",
      read: false,
      important: false,
      body: "Parabéns! Sua postagem está recebendo atenção."
    },
    {
      id: "n2",
      title: "Você se registrou com sucesso em uma conta Vidnoz.",
      date: "2025-04-25T06:32:00",
      avatar: "https://images.unsplash.com/photo-1545996124-76f3f8d4476b?w=600&q=60",
      read: true,
      important: false,
      body: "Bem-vindo! Verifique seu e-mail para confirmação."
    },
    {
      id: "n3",
      title: "Alguém comentou no seu post: 'Ótimo conteúdo!'",
      date: "2025-07-05T13:02:00",
      avatar: "https://images.unsplash.com/photo-1545996124-76f3f8d4476b?w=600&q=60",
      read: false,
      important: true,
      body: "Comentário com destaque do usuário."
    }
  ];
  
  const listEl = document.getElementById("list");
  const template = document.getElementById("notification-template");
  const tabUnread = document.getElementById("tab-unread");
  const tabPrevious = document.getElementById("tab-previous");
  const markAllBtn = document.getElementById("markAllRead");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  
  let currentFilter = "unread"; // 'unread' or 'previous'
  
  // Utils
  function formatDate(iso){
    const d = new Date(iso);
    const opts = { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' };
    return d.toLocaleString('pt-BR', opts);
  }
  
  // Render
  function render(){
    listEl.innerHTML = "";
    // escolha as notificações conforme filtro
    const items = notifications.filter(n => {
      if (currentFilter === "unread") return !n.read;
      if (currentFilter === "previous") return n.read;
      return true;
    });
  
    if(items.length === 0){
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.style.padding = "30px";
      empty.style.textAlign = "center";
      empty.style.color = "var(--muted)";
      empty.textContent = currentFilter === "unread" ? "Nenhuma notificação não lida." : "Nenhuma notificação anterior.";
      listEl.appendChild(empty);
      return;
    }
  
    items.forEach(n => {
      const node = template.content.cloneNode(true);
      const card = node.querySelector(".notification-card");
      const avatar = node.querySelector(".avatar");
      const title = node.querySelector(".title");
      const dateEl = node.querySelector(".date");
      const del = node.querySelector(".delete");
      const markBtn = node.querySelector(".mark-btn");
      const snippet = node.querySelector(".snippet");
  
      card.dataset.id = n.id;
      avatar.src = n.avatar;
      title.textContent = n.title;
      dateEl.textContent = formatDate(n.date);
      snippet.textContent = n.body;
      if(n.read) card.classList.add("read"); else card.classList.add("unread");
      if(n.important) card.classList.add("important");
  
      // clicar na notificação => abre modal e marca como lida
      card.addEventListener("click", (e) => {
        // evitar disparo quando clicar em botões internos (excluir/marcar)
        if(e.target.closest(".delete") || e.target.closest(".mark-btn")) return;
        openModal(n);
        if(!n.read){ n.read = true; render(); }
        // aqui você poderia chamar API para salvar estado read=true
      });
  
      // deletar
      del.addEventListener("click", (ev) => {
        ev.stopPropagation();
        removeNotification(n.id);
      });
  
      // marcar como não lida / lida (toggle)
      markBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        n.read = !n.read;
        render();
        // chamar API para atualizar if necessário
      });
  
      // swipe to delete on touch devices
      addSwipeToDelete(card, n.id);
  
      listEl.appendChild(node);
    });
  }
  
  // abrir modal
  function openModal(n){
    modalTitle.textContent = n.title;
    modalBody.textContent = `${formatDate(n.date)}\n\n${n.body}`;
    modal.classList.remove("hidden");
  }
  closeModal.addEventListener("click", ()=> modal.classList.add("hidden"));
  modal.addEventListener("click", (e)=> { if(e.target===modal) modal.classList.add("hidden") });
  
  // remover
  function removeNotification(id){
    const idx = notifications.findIndex(x => x.id === id);
    if(idx>-1){
      notifications.splice(idx,1);
      render();
      // aqui chamar API para remoção remota
    }
  }
  
  // tab switching
  tabUnread.addEventListener("click", ()=> switchTab("unread"));
  tabPrevious.addEventListener("click", ()=> switchTab("previous"));
  
  function switchTab(key){
    currentFilter = key;
    tabUnread.classList.toggle("active", key==="unread");
    tabPrevious.classList.toggle("active", key==="previous");
    tabUnread.setAttribute("aria-pressed", key==="unread");
    tabPrevious.setAttribute("aria-pressed", key==="previous");
    render();
  }
  
  // marcar tudo como lido
  markAllBtn.addEventListener("click", ()=>{
    notifications.forEach(n => n.read = true);
    switchTab("previous");
  });
  
  // swipe helper (simple)
  function addSwipeToDelete(cardEl, id){
    let startX = 0;
    let currentX = 0;
    let touching = false;
  
    cardEl.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      touching = true;
      cardEl.style.transition = "none";
    }, {passive:true});
  
    cardEl.addEventListener('touchmove', (e) => {
      if(!touching) return;
      currentX = e.touches[0].clientX - startX;
      // mover horizontalmente (somente para feedback)
      if(Math.abs(currentX) > 5){
        cardEl.style.transform = `translateX(${currentX}px)`;
      }
    }, {passive:true});
  
    cardEl.addEventListener('touchend', (e) => {
      touching = false;
      cardEl.style.transition = "transform .2s ease";
      if(Math.abs(currentX) > 120){
        // considera como delete
        cardEl.style.transform = `translateX(${currentX > 0 ? 1000 : -1000}px)`;
        setTimeout(()=> removeNotification(id), 200);
      } else {
        cardEl.style.transform = '';
      }
      startX = currentX = 0;
    }, {passive:true});
  }
  
  render();
  