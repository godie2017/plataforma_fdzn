import React, {useReducer, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {TextField,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Link
} from '@material-ui/core';
import {compose} from 'recompose';
import { consumerFirebase } from '../server'

const useStyles = makeStyles({
  root: {
    alignItems: 'center',
    flexDirection: '',
    backgroundColor: '#f5f5f5',
    marginTop: 10,
    padding: 10,
    primary: {
      main : '#10A75f'
    }
  },
  form: {
    minWidth: 280,// Tamaño del formulario
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginBottom: 20,
  },
  inputs: {
    marginBottom: 16
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 1,
  },
  button: {
    marginTop: 20,
    display: 'flex',
    //alignItems: 'center', reduce el boton
    flexDirection: 'column',
  },
  div_login:{
    display: 'inline-block',
  }
});

const initialState = {
  firebase: null,
  login: {
    email:'',
    pass:'',
  },
  nuevoReg:{
    registro: false,
    nit: '',
    nombre: '',
    apellidos: '',
    email:'',
    pass: '',
    conf_pass: '',
  },
  val:{
    nit:false,
    nombre:false,
    apellidos:false,
    email:false,
    pass:false,
    conf_pass:false,
  }
}

function Login(props){

  const classes = useStyles();

  const appReducer = (estado, action) => {
    switch (action.type) {
      case 'FIREBASE_DAT':
        return {...estado,
          firebase: action.payload.firebase
        }
      case 'LOGIN':
        return {...estado,
          login: action.payload.login,
          val : {
            ...estado.val,
            email:action.payload.valida.email,
            pass: action.payload.valida.pass
          },
        };
      case 'REG':
        return {...estado,
          nuevoReg:action.payload.newReg,
          val: {
            ...estado.val,
            nit: action.payload.valida.nit,
            nombre: action.payload.valida.nombre,
            apellidos: action.payload.valida.apellidos,
            email: action.payload.valida.email,
            pass: action.payload.valida.pass,
            conf_pass:action.payload.valida.conf_pass,
          }
        };
      case 'LOGIN_TO_REG':
        return {...estado,
          login:{
            email: '',
            pass: ''
          },
          nuevoReg: {
            nit: '',
            nombre: '',
            apellidos: '',
            email: '',
            pass: '',
            conf_pass: '',
            registro: action.payload.registro
          },
          val: {
            nit:false,
            nombre:false,
            apellidos:false,
            email:false,
            pass:false,
            conf_pass:false,
          }
        };
      case 'VALIDA':
        return {...estado,
          val: action.payload.valida
        };
      default:
        console.log('Accción no encontrada');
    }
  }


  const [estado, dispatch] = useReducer(appReducer, initialState)

  const onChangeLogin = e => {
    //e.persist();
    let login = Object.assign({}, estado.login);
    let valida = Object.assign({}, estado.val);
    login[e.target.name] = e.target.value;
    login[e.target.name] === '' ? valida[e.target.name] = true : valida[e.target.name] = false

    dispatch({
      type: 'LOGIN',
      payload: {login, valida}
    });
  }
  const onChangeReg = e => {
    //e.persist();
    let newReg = Object.assign({}, estado.nuevoReg);
    let valida = Object.assign({}, estado.val);
    newReg[e.target.name] = e.target.value;
    newReg[e.target.name] === '' ? valida[e.target.name] = true : valida[e.target.name] = false
    dispatch({
      type: 'REG',
      payload: {newReg, valida}
    });
  }

  const changeToReg = () =>{
    document.getElementById("formLogReg").reset();
    dispatch({
      type: 'LOGIN_TO_REG',
      payload: {
        registro:!estado.nuevoReg.registro,
      }
    });
  }

  const validar = () => {
    let valida = Object.assign({}, estado.val);
    let log = Object.assign({}, estado.login);
    let reg = Object.assign({}, estado.nuevoReg);

    if(estado.nuevoReg.registro === false){//login
      let check = [];
      for (var clave in log){
        if(log[clave] === ''){
          valida[clave] = true;
          check.push(clave);
          dispatch({
            type: 'VALIDA',
            payload: {valida}
          });
        }
      }
      if(check.length === 0){return {Is:true, tipo: 'login'}}else{return {Is:false, tipo: 'login'}}
    }else{
      let check = [];
      for (let clave in reg){
        if(reg[clave] === '' && reg[clave] !== 'registro'){
          valida[clave] = true;
          check.push(clave);
          dispatch({
            type: 'VALIDA',
            payload: {valida}
          });
        }
      }
      if(check.length === 0){return {Is:true, tipo: 'registro'}}else{return {Is:false, tipo: 'registro'}}
    }
  }

  const onClick = () =>{
    var resul = validar();
    if(resul.Is && resul.tipo === 'login'){
      console.log('Se loguea')
    }else if(resul.Is && resul.tipo === 'registro'){
      console.log('Se registra')

      const {nuevoReg, firebase} = estado;
      firebase.db.collection("Usuarios").add(
        {
          nit: nuevoReg.nit,
          nombre: nuevoReg.nombre,
          apellidos: nuevoReg.apellidos,
          email: nuevoReg.email,
          password: nuevoReg.pass,
          creado: new Date(),
          estado: 0,
          objRedimidos:null,
          photourl:null,
          ptosRedimidos: 0,
          puntos: 0,
          telefono: null,
          uid: null,
          ultimoLogin:null,
          id:null
        }
      ).then(nuevoUsuario =>{
        firebase.db.collection('Usuarios').doc(nuevoUsuario.id)
          .set({id: nuevoUsuario.id},{merge:true})
          .then(() => console.log('Id agregado'))
          .catch(error => console.log(error))
      }).catch(error => console.log(error))
    }else{
      console.log(`Falló el ${resul.tipo}.`)
    }
  }




  useEffect(()=>{
    const chargeFirebase = props => {
      if(props.firebase){
        dispatch({
          type: 'FIREBASE_DAT',
          payload: {firebase: props.firebase}
        });
      }
    }

  chargeFirebase(props)

},[props])


  return (
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography variant="h5" component="h2">
                {estado.nuevoReg.registro ? 'Registro' : 'Login'}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
              </Typography>
            </CardContent>
            <CardActions className={classes.div_login}>
              <form id='formLogReg' className={classes.form} noValidate autoComplete="off">
                  {estado.nuevoReg.registro ?<TextField
                    value={estado.nuevoReg.nit}
                    className={classes.inputs}
                    error ={estado.val.nit}
                    id="standard-error-helper-text"
                    label="Nit"
                    helperText= {estado.val.nit ? "Nit incorrecto." : ''}
                    name='nit'
                    onChange={onChangeReg}
                    fullWidth
                  /> : null}
                  {estado.nuevoReg.registro ?<TextField
                    className={classes.inputs}
                    error ={estado.val.nombre}
                    id="standard-error-helper-text"
                    label="Nombre"
                    helperText= {estado.val.nombre ? "Nombre incorrecto." : ''}
                    name='nombre'
                    onChange={onChangeReg}
                    fullWidth
                  /> : null}
                  {estado.nuevoReg.registro ?<TextField
                    className={classes.inputs}
                    error ={estado.val.apellidos}
                    id="standard-error-helper-text"
                    label="Apellidos"
                    helperText= {estado.val.apellidos ? "Apellidos incorrecto." : ''}
                    name='apellidos'
                    onChange={onChangeReg}
                    fullWidth
                  /> : null}
                  <TextField
                    className={classes.inputs}
                    error ={estado.val.email}
                    id="standard-error"
                    label="Correo"
                    helperText={estado.val.email ? "Usuario incorrecto." : ''}
                    name='email'
                    onChange={ estado.nuevoReg.registro ? onChangeReg : onChangeLogin}
                    fullWidth
                  />
                  <TextField
                    className={classes.inputs}
                    error ={estado.val.pass}
                    id="standard-error-helper-text"
                    label="Password"
                    helperText={estado.val.pass ? "Password incorrecto." : ''}
                    name='pass'
                    onChange={ estado.nuevoReg.registro ? onChangeReg : onChangeLogin}
                    fullWidth
                  />
                  {estado.nuevoReg.registro ?<TextField
                    className={classes.inputs}
                    error ={estado.val.conf_pass}
                    id="standard-error-helper-text"
                    label="Confirmar password"
                    helperText= {estado.val.conf_pass ? 'Confirmación incorrecta' : ''}
                    name='conf_pass'
                    onChange={ onChangeReg }
                    fullWidth
                  /> : null}
              </form>
              <div >
                <Typography variant="subtitle2" gutterBottom>
                  {estado.nuevoReg.registro ? 'Inicia sesión' : 'Registrate'}&nbsp;
                  <Link
                    component="button"
                    variant="body2"
                    onClick={changeToReg}
                  > Aqui!
                  </Link>
                </Typography>
              </div>

              <div className={classes.button}>
                <Button variant="contained" color="primary"
                onClick={onClick}>
                  {estado.nuevoReg.registro ? 'Registrar' : 'Login'}
                </Button>
              </div>
            </CardActions>
          </Card>
  );
}

export default compose(consumerFirebase)(Login);
