var cores_claro = [
    ["--verde_especial","#339933"],
    ["--preto", "#1b1b1b"],
    ["--branco", "white"],
    ["--brancobg", "#ffffff"],
    ["--cinza","gray"],
    ["--cinzaclaro","#ccc"],
    ["--cordefundopadrao","#f0f0f0"],
    ["--verdenavfooter","#2a8d3f"],
    ["--verdeneon","#42ff21"],
    ["--brancofraco","#f1f1f1"],
    ["--postcor", "white"],
    ["--textopost", "#333"],
    ["--textopostinfo", "#777"],
    ["--hoverplanos", "#cdf7cf"],
    ["--searchbar", "#216F27"]
  ];
  
  var cores_escuro = [
    ["--verde_especial","#339933"],
    ["--preto", "#1b1b1b"],
    ["--branco", "white"],
    ["--brancobg", "#ffffff"],
    ["--cinza","gray"],
    ["--cinzaclaro","#ccc"],
    ["--cordefundopadrao","#0d0d0d"],
    ["--verdenavfooter","#216F27"],
    ["--verdeneon","#42ff21"],
    ["--brancofraco","#f1f1f1"],
    ["--postcor", "#373434"],
    ["--textopost", "white"],
    ["--textopostinfo", "#ccc"],
    ["--hoverplanos", "#1f2e20"],
    ["--searchbar", "#2a8d3f"]
  ];
  
  function setDarkMode() {
    for (let i = 0; i < cores_escuro.length; i++) {
      document.documentElement.style.setProperty(cores_escuro[i][0], cores_escuro[i][1]);
    }
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    localStorage.setItem('mode', 'dark');
  
    const moonIcon = document.querySelector('.brilho-icon:last-child');
    moonIcon.style.animation = 'none';
    void moonIcon.offsetWidth;
    moonIcon.style.animation = '';
  }
  
  function setLightMode() {
    for (let i = 0; i < cores_claro.length; i++) {
      document.documentElement.style.setProperty(cores_claro[i][0], cores_claro[i][1]);
    }
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    localStorage.setItem('mode', 'light');
    const sunIcon = document.querySelector('.brilho-icon:first-child');
    sunIcon.classList.add('sun-animate');
    setTimeout(() => {
      sunIcon.classList.remove('sun-animate');
    }, 1000);
  }
  
  function toggleMode() {
    const isDarkMode = localStorage.getItem('mode') === 'dark';
    if (isDarkMode) {
      setLightMode();
    } else {
      setDarkMode();
    }
  }
  
  function loadMode() {
    const mode = localStorage.getItem('mode');
    if (mode === 'dark') {
      setDarkMode();
    } else {
      setLightMode();
    }
  }
  
  window.onload = loadMode;

  window.onload = () => {
    const sunIcon = document.querySelector('.brilho-icon:first-child');
    sunIcon.style.animationDelay = '0s';
    loadMode();
  };
  