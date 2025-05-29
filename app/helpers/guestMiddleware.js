// middleware/redirectIfLogged.js
module.exports = (req, res, next) => {
    if (req.session && req.session.usuario) {
        if (req.path === '/login' || req.path === '/cadastre-se') {
            return res.redirect('/perfilex');
        }
    }
    next();
 
   
};
 