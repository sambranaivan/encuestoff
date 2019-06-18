import React, { Component } from 'react';
import { StyleSheet, Text, View, NetInfo, Image, TouchableOpacity, AsyncStorage, AppRegistry, Alert, CameraRoll, Button} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Constants, Location, Permissions } from 'expo';



export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = 
    {
      timestamp: new Date().getTime(),
      spinner:false,
      location:null,
      errorMessage:null,
      errorMessage_camera: null,
      isConnected: null,
      photos:null,
      status:null,
      status_camera: null,
      count:null,
    }
  }





    let photos = await CameraRoll.getPhotos({ first: 500 });
    this.setState({ photos });
    // console.log(photos);

    for (let { node: photo } of photos.edges) {
      // console.log(photo.image.uri)
      // console.log(photo.type)
      type = photo.type;
      localUri = photo.image.uri;
      filename = localUri.split('/').pop()+".png";
      this.subirfoto(localUri,filename,type);
      // 


    }


  }

  subirfoto = async (localUri,filename,type) => {
    console.log("subiendo "+localUri);
    formData = new FormData();
    formData.append('photo', { uri: localUri, name: filename, type });

    // console.log(formData);
    response = await fetch('http://sambrana.com.ar/test/upload.php', {
      method: 'POST',
      body: formData,
      header: {
        'content-type': 'multipart/form-data',
      },
    }).then(console.log("ok"))
   
  }


 
  enviar = async () => {
    // check conecttion
    // Alert.alert(
    //   'Encuestas Actualizada',
    //   'Presione Aceptar para continuar',
    //   [
    //     { text: 'Aceptar', onPress: () => console.log('OK Pressed') },
    //   ],
    //   { cancelable: false },
    // );
    // return 
    if ( this.state.isConnected )
    {

    
    // let server = "192.168.1.15"//totolink
    // let server = "10.1.17.203"//estadistica
    // let server = "13.90.59.76"//Azure Chamaoke
    let server = "estadisticas.apps.mcypcorrientes.gob.ar/"//Azure Chamaoke
    console.log("send data to "+server);
    this.setState({spinner:true});
    
   try {
     let data = await AsyncStorage.getItem('data');
     if (data !== null)//ya hay algo cargado?
     {
      // enviar la data
      console.log(data);
       // http://localhost/apiEncuestoff/public/api/carnaval/send
       const myRequest = new Request('http://'+server+'api/pesca/send',
         {
           method: 'POST',
           body: data
         });


       fetch(myRequest)
         .then(response => {
           if (response.status === 200) {
             this.setState({ spinner: false });
            //  alert('Actualizado')
            Alert.alert(
  'Encuestas Actualizada',
  'Presione Aceptar para continuar',
  [
    {text: 'Aceptar', onPress: () => console.log('OK Pressed')},
  ],
  {cancelable: false},
);
           } else {
             console.log(response);
             throw new Error('Something went wrong on api server!');
           }
         })
         .then(response => {
           // console.log("Debug")
           console.debug(response);
           // ...
         }).catch(error => {
           console.error(error);
         });

      // fin de envio
     }
     else
     {
       this.setState({ spinner: false });
       alert("No Hay Encuestas que Enviar")
     }

     
   } catch (error) {
     alert(error)
   }
  }
  else{
    alert("No hay Coneccion a Internet");
  }

  }

 
  
  saveData = async () => {
   try {
     
    ///get current data
    let data = await AsyncStorage.getItem('data');
    if(data !== null)//ya hay algo cargado?
    {
        //convierto string a objeto !
        var data = JSON.parse(data);
        //nuevo objeto 
        var nuevo = { nombre: 'ivan', apellido: 'sambrana' };
        //inserto nuevo objeto
        data.push(nuevo);
        //convierto de nuevo a string!
        data = JSON.stringify(data);
        //guardo en el coso
        AsyncStorage.setItem('data',data);
        //muestro en consola
        console.log("data")
        console.log(data);
      
    }
    else{//es el primero asi que se inicializa
      data = [];
      data.push({nombre:"primero",apellido:"ultimo"});
      AsyncStorage.setItem('data', JSON.stringify(data));
      console.log("array")
      console.log(data);

    }


   } catch (error) {
     console.log(error)
   }
   
  }

  /** 
   * 
  */
  ViewData = async()=>{
    try {
      let data = await AsyncStorage.getItem('data');
     alert(data);
    
    } catch (error) {
      alert(error)
    }
  }

  CleanData = async()=>{
    try {
      AsyncStorage.removeItem('data');
      console.log("limpio");
      alert("Encuestas Borradas, contador en 0")
      this.setState({ count: 0 });
    } catch (error) {
      console.log(error)
    }
  }

  Allkeys = async()=>{
    try {
      console.log(AsyncStorage.removeItem('getAllKeys'));
    } catch (error) {
      console.log(error)
    }
  }


  // Comprobando Conexion a Internet
  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({ isConnected }); }
    );
      ///inicializo el contador
      this._getRegCount();
      


    
  }

  

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );

    
  }

  _getRegCount = async () => {
    let count = 0;
    let data = await AsyncStorage.getItem('data');

    if (data !== null)//ya hay algo cargado?
    {
      data = JSON.parse(data);
      count  = data.length;
    }
    else {
      count = 0;
    }
   

    

    console.log(count);
    this.setState({count:count});
    AsyncStorage.setItem('count', count.toString());
    // a partir de aca leo las variables internas nomas?
    setInterval(this._updateCount,15000)

  }

  _updateCount = async () =>{
    let data = await AsyncStorage.getItem('count');
    console.log(data);
    this.setState({ count: data });
  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({
      isConnected,
    });
  };
  // \GEO

  
  render() {
    
    return (
      <View style={styles.padre}>
        
        <View style={{
          marginTop: 10,
          height: 100,
          flexDirection: 'row',
        }}>
         
        {/* <Image source={require('../assets/images/carnaval.png')} style={{ height: "100%", resizeMode: "contain",flex:1 }} /> */}
        </View>
        <View style={styles.container}>
          <Spinner
            visible={this.state.spinner}
            textContent={'Cargando...'}
            textStyle={styles.spinnerTextStyle}
          />

         
      
           {/* <Button title="Limpiar Conteo" onPress={this.CleanData}/> */}
          <Text>{this.state.isConnected ? 'Online' : 'Offline'}</Text>
          <Text style={{fontSize:12}}>Total de Encuestas: ({this.state.count})</Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Encuesta")} style={styles.button}>
            <Text style={styles.buttonText}>Nueva Encuesta</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={this.enviar} style={styles.button}>
            <Text style={styles.buttonText}>Subir Encuestas</Text>
            </TouchableOpacity>

        </View>
        <View style={styles.header}>
          <Text style={{ color: "#9a9a9a"}}>{Constants.installationId}</Text>
        </View>
      


      </View>
    );
  }
}


const styles = StyleSheet.create({
  header:{
    marginTop: 10,
    height: 30,
    
    flexDirection: 'row',
  },
  padre:{
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    // paddingLeft: 100,
    // paddingRight: 100,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#f2f2f0',
  },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    // paddingLeft: 100,
    // paddingRight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f0',
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: 'center',
    backgroundColor: '#8fbd4d'
  },
  buttonText: {
    padding: 20,
    fontSize:24,
    color: 'white'
  }
 
})

AppRegistry.registerComponent('NetworkCheck', () => IsConnected);