import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button,Alert, Platform,Image, AsyncStorage, TouchableOpacity} from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import t from 'tcomb-form-native';
import MultiSelect from 'react-native-multiple-select';


const Form = t.form.Form;

// // // // // // // // // // // // //
// Esto va a cambiar a cada rato

const User = t.struct({
    latitud:t.maybe(t.Number),///automaticos
    longitud: t.maybe(t.Number),///automaticos
    procedencia: t.String,
    sexo: t.enums({
        'F': 'Femenino',
        'M': 'Masculino'
    }, 'Sexo'),
    edad: t.Number,//TODO cambiar a rangos

    viaje: t.maybe(t.enums({
        solo: 'Solo',
        pareja: 'Pareja',
        familia: 'Familia',
        amigos: 'Amigos',
    })),
    viaje_cantidad: t.maybe(t.Number),///autofill, condicional por viaje
    informo: t.maybe(t.enums({
        familia: 'Familia / Amigos',
        internet: 'Redes Sociales (Facebook, Instagram, Twitter, Whatsapp)',
        medios: 'Medios de Comunicación (tv, radio)',
        otro:'Otro'
    })),
    otros_informo: t.maybe(t.String),//condicional de por donde se informo
    motivo: t.maybe(t.enums({
        carnaval: 'Carnaval',
        vacaciones: 'Vacaciones',
        religion: 'Religion',
        trabajo: "Trabajo",
        visita: "Visita Flia/Amigos",
        salud: "Salud",
        pesca: "Pesca",
        otro: "Otro"
    })),
    otro_motivo: t.maybe(t.String),//condicional de motivo de viaje
    transporte: t.maybe(t.enums({
        omnibus: 'Omnibus',
        auto: 'Automovil',
        corrientes: 'Aeropuerto Corrientes',
        resistencia: 'Aeropuerto Resistencia',
        moto: 'Moto',
        otro: 'Otro'
    })),
    otro_transporte: t.maybe(t.String),//condicional de transporte de viaje

    alojamiento: t.maybe(t.enums({
        corrientes: 'Corrientes',
        empedrado: 'Empedrado',
        itati: 'Itatí',
        paso: 'Paso de la Patria',
        Ramada: 'Ramada Paso',
        sancosme: 'San Cosme',
        santaana: 'Santa Ana de los Guacaras',
        resistencia: 'Resistencia'
    })),
    tipoalojamiento: t.maybe(t.enums({
       hotel:"Hotel",
       casa_familia:"Vivienda de Familiares o Amigos",
       casa_alquilada:"Vivienda Alquilada",
       polideportivo:"Polideportivo",
       dpto:"Departamento",
       no_se_aloja: "No se Aloja"
    })),

    primeravez: t.enums({
        si: 'Si',
        no: 'No'
    }),

    // recomendaria: t.enums({
    //     si: 'Si', no: 'No', talvez: 'Tal Vez'
    // }),

    gastos: t.enums(
        {
            a: 'Menos de $500',
            b: 'De $500 a $1.000',
            c: 'Entre $1.000 y $3.000',
            d: 'Más de $3.000',
            e: 'No sabe No Contesta'
        }),
        opinion:t.maybe(t.String),
    userid: t.String,timestamp: t.maybe(t.String)
});


var options = {
    i18n: {
        optional: ' ',
        required: ' '
    },
    fields: {
        latitud:{
            hidden:true
        },
        longitud: {
            hidden: true
        },
        userid:{
            hidden:true
        },
        timestamp:{
            hidden:true
        },

        procedencia:{
            label: "Procedencia",
            hidden: true
        },
        viaje: {
            label: '¿Con quién viaja?' ,// <= label for the name field
            hidden:false
        },
        informo: {
            label: '¿Como se infomó del evento?' ,// <= label for the name field
            hidden:false
        },
        motivo: {
            label: '¿Motivo del viaje?' ,// <= label for the name field
            hidden:false
        },
        gastos: {
            label: '¿Cuanto estima que gastó durante la estadia por persona por día?', // <= label for the name field
            // hidden:false,
        },
        calificacion: {
            label: '¿Como califica el evento?' // <= label for the name field
        },
        recomendaria: {
            label: '¿Recomendaria el evento?' // <= label for the name field
        },
        alojamiento: {
            label: '¿En que ciudad se aloja durante su estadía?' ,// <= label for the name field
            hidden:false
        },
        tipoalojamiento: {
            label: '¿En que tipo de alojamiento?' ,// <= label for the name field
            hidden:false
        },
        transporte: {
            label: '¿Medio de transporte utilizado?' ,// <= label for the name field
            hidden:false
        },
        primeravez: {
            label: '¿Primera vez que asiste?' // <= label for the name field
        },
        edad: {
            label: "Edad", hidden: false, maxLength: 2,
            optional: '',
            required: ' (required)' // inverting the behaviour: adding a postfix to the required fields
        },
        opinion:{
            label:"¿Que te parece que se debería mejorar de este evento?",
            hidden:false
        },

        // condicionales
        otro_motivo:
        {
            label: "Cual?",hidden:true
        },
        otros_informo: {
            label: "Cual?", hidden: true
        },
        otro_transporte: {
            label: "Cual?", hidden: true
        },
        viaje_cantidad:{
            label: "Cuantos?", hidden: true, maxLength: 2
        }
        
    }
};

var default_values = {
    userid: Constants.installationId,
    procedencia: null,
    edad:null,
            viaje: null,
            motivo: null,
            alojamiento: null,
            tipoalojamiento: null,
    informo: null,
            transporte: null,
            gastos: null,
            latitud:null,
            longitud:null,
            opinion:null
            
}
//  
// // // // // // // // // // // // 



// listado de provincias y paises
const items = [
    { name: "Corrientes", id: "Corrientes" },
    { name: "Tres de Abril", id: "Tres de Abril" },
    { name: "9 de Julio", id: "9 de Julio" },
    { name: "Alvear", id: "Alvear" },
    { name: "Bella Vista", id: "Bella Vista" },
    { name: "Berón de Astrada", id: "Berón de Astrada" },
    { name: "Bonpland", id: "Bonpland" },
    { name: "Caá Catí", id: "Caá Catí" },
    { name: "Colonia Carlos Pellegrini", id: "Colonia Carlos Pellegrini" },
    { name: "Colonia Carolina", id: "Colonia Carolina" },
    { name: "Chavarría", id: "Chavarría" },
    { name: "Colonia Libertad", id: "Colonia Libertad" },
    { name: "Colonia Liebig", id: "Colonia Liebig" },
    { name: "Colonia Pando", id: "Colonia Pando" },
    { name: "Concepción", id: "Concepción" },
    { name: "Cruz de los Milagros", id: "Cruz de los Milagros" },
    { name: "Curuzú Cuatiá", id: "Curuzú Cuatiá" },
    { name: "Empedrado", id: "Empedrado" },
    { name: "Esquina", id: "Esquina" },
    { name: "Estación Torrent", id: "Estación Torrent" },
    { name: "Felipe Yofre", id: "Felipe Yofre" },
    { name: "Garabí", id: "Garabí" },
    { name: "Garruchos", id: "Garruchos" },
    { name: "Gobernador Martinez", id: "Gobernador Martinez" },
    { name: "Gobernador V. Virasoro", id: "Gobernador V. Virasoro" },
    { name: "Goya", id: "Goya" },
    { name: "Guaviraví", id: "Guaviraví" },
    { name: "Herliztka", id: "Herliztka" },
    { name: "Ita Ibaté", id: "Ita Ibaté" },
    { name: "Itatí", id: "Itatí" },
    { name: "Ituzaingó", id: "Ituzaingó" },
    { name: "José Rafael Gomez", id: "José Rafael Gomez" },
    { name: "Juan Pujol", id: "Juan Pujol" },
    { name: "La Cruz", id: "La Cruz" },
    { name: "San Isidro", id: "San Isidro" },
    { name: "Lomas de Vallejos", id: "Lomas de Vallejos" },
    { name: "Loreto", id: "Loreto" },
    { name: "Mariano I. Loza", id: "Mariano I. Loza" },
    { name: "Mburucuyá", id: "Mburucuyá" },
    { name: "Mercedes", id: "Mercedes" },
    { name: "Mocoretá", id: "Mocoretá" },
    { name: "Monte Caseros", id: "Monte Caseros" },
    { name: "Pago de los Deseos", id: "Pago de los Deseos" },
    { name: "Palmar Grande", id: "Palmar Grande" },
    { name: "Parada Pucheta", id: "Parada Pucheta" },
    { name: "Paso de la Patria", id: "Paso de la Patria" },
    { name: "Paso de los Libres", id: "Paso de los Libres" },
    { name: "Pedro R. Fernandez", id: "Pedro R. Fernandez" },
    { name: "Perugorria", id: "Perugorria" },
    { name: "Pueblo Libertador", id: "Pueblo Libertador" },
    { name: "Lavalle", id: "Lavalle" },
    { name: "Ramada Paso", id: "Ramada Paso" },
    { name: "Riachuelo", id: "Riachuelo" },
    { name: "Saladas", id: "Saladas" },
    { name: "San Antonio de Apipe", id: "San Antonio de Apipe" },
    { name: "San Carlos", id: "San Carlos" },
    { name: "San Cosme", id: "San Cosme" },
    { name: "San Lorenzo", id: "San Lorenzo" },
    { name: "San Luis del Palmar", id: "San Luis del Palmar" },
    { name: "San Miguel", id: "San Miguel" },
    { name: "San Roque", id: "San Roque" },
    { name: "Santa Ana de los Guacaras", id: "Santa Ana de los Guacaras" },
    { name: "Santa Lucía", id: "Santa Lucía" },
    { name: "Colonia Santa Rosa", id: "Colonia Santa Rosa" },
    { name: "Santo Tome", id: "Santo Tome" },
    { name: "Sauce", id: "Sauce" },
    { name: "Tabay", id: "Tabay" },
    { name: "Tapebicuá", id: "Tapebicuá" },
    { name: "Tatacua", id: "Tatacua" },
    { name: "Villa Olivari", id: "Villa Olivari" },
    { name: "Yapeyú", id: "Yapeyú" },
    { name: "Yatayti Calle", id: "Yatayti Calle" },
    { name: "El Sombrero", id: "El Sombrero" },
    {
    name: "Capital Federal",
    id: "Capital Federal",
    },
    {
        name: "Buenos Aires",
        id: "Buenos Aires",
    },
    {
        name: "Catamarca",
        id: "Catamarca",
    },
    {
        name: "Chaco",
        id: "Chaco",
    },
    {
        name: "Chubut",
        id: "Chubut",
    },
    {
        name: "Cordoba",
        id: "Cordoba",
    },
  
    {
        name: "Entre Rios",
        id: "Entre Rios",
    },
    {
        name: "Formosa",
        id: "Formosa",
    },
    {
        name: "Jujuy",
        id: "Jujuy",
    },
    {
        name: "La Pampa",
        id: "La Pampa",
    },
    {
        name: "La Rioja",
        id: "La Rioja",
    },
    {
        name: "Mendoza",
        id: "Mendoza",
    },
    {
        name: "Misiones",
        id: "Misiones",
    },
    {
        name: "Neuquen",
        id: "Neuquen",
    },
    {
        name: "Rio Negro",
        id: "Rio Negro",
    },
    {
        name: "Salta",
        id: "Salta",
    },
    {
        name: "San Juan",
        id: "San Juan",
    },
    {
        name: "San Luis",
        id: "San Luis",
    },
    {
        name: "Santa Cruz",
        id: "Santa Cruz",
    },
    {
        name: "Santa Fe",
        id: "Santa Fe",
    },
    {
        name: "Santiago del Estero",
        id: "Santiago del Estero",
    },
    {
        name: "Tierra del Fuego",
        id: "Tierra del Fuego",
    },
    {
        name: "Tucuman",
        id: "Tucuman",
    },
    {
        name: "Afganistan",
        id: "Afganistan"
    },
    {
        name: "Albania",
        id: "Albania"
    },
    {
        name: "Alemania",
        id: "Alemania"
    },
    {
        name: "Andorra",
        id: "Andorra"
    },
    {
        name: "Angola",
        id: "Angola"
    },
    {
        name: "Antartida",
        id: "Antartida"
    },
    {
        name: "Antigua y Barbuda",
        id: "Antigua y Barbuda"
    },
    {
        name: "Arabia Saudi",
        id: "Arabia Saudi"
    },
    {
        name: "Argelia",
        id: "Argelia"
    },
    {
        name: "Argentina",
        id: "Argentina"
    },
    {
        name: "Armenia",
        id: "Armenia"
    },
    {
        name: "Australia",
        id: "Australia"
    },
    {
        name: "Austria",
        id: "Austria"
    },
    {
        name: "Azerbaiyan",
        id: "Azerbaiyan"
    },
    {
        name: "Bahamas",
        id: "Bahamas"
    },
    {
        name: "Bahrain",
        id: "Bahrain"
    },
    {
        name: "Bangladesh",
        id: "Bangladesh"
    },
    {
        name: "Barbados",
        id: "Barbados"
    },
    {
        name: "Belgica",
        id: "Belgica"
    },
    {
        name: "Belice",
        id: "Belice"
    },
    {
        name: "Benin",
        id: "Benin"
    },
    {
        name: "Bermudas",
        id: "Bermudas"
    },
    {
        name: "Bielorrusia",
        id: "Bielorrusia"
    },
    {
        name: "Birmania Myanmar",
        id: "Birmania Myanmar"
    },
    {
        name: "Bolivia",
        id: "Bolivia"
    },
    {
        name: "Bosnia y Herzegovina",
        id: "Bosnia y Herzegovina"
    },
    {
        name: "Botswana",
        id: "Botswana"
    },
    {
        name: "Brasil",
        id: "Brasil"
    },
    {
        name: "Brunei",
        id: "Brunei"
    },
    {
        name: "Bulgaria",
        id: "Bulgaria"
    },
    {
        name: "Burkina Faso",
        id: "Burkina Faso"
    },
    {
        name: "Burundi",
        id: "Burundi"
    },
    {
        name: "Butan",
        id: "Butan"
    },
    {
        name: "Cabo Verde",
        id: "Cabo Verde"
    },
    {
        name: "Camboya",
        id: "Camboya"
    },
    {
        name: "Camerun",
        id: "Camerun"
    },
    {
        name: "Canada",
        id: "Canada"
    },
    {
        name: "Chad",
        id: "Chad"
    },
    {
        name: "Chile",
        id: "Chile"
    },
    {
        name: "China",
        id: "China"
    },
    {
        name: "Chipre",
        id: "Chipre"
    },
    {
        name: "Colombia",
        id: "Colombia"
    },
    {
        name: "Comores",
        id: "Comores"
    },
    {
        name: "Congo",
        id: "Congo"
    },
    {
        name: "Corea del Norte",
        id: "Corea del Norte"
    },
    {
        name: "Corea del Sur",
        id: "Corea del Sur"
    },
    {
        name: "Costa de Marfil",
        id: "Costa de Marfil"
    },
    {
        name: "Costa Rica",
        id: "Costa Rica"
    },
    {
        name: "Croacia",
        id: "Croacia"
    },
    {
        name: "Cuba",
        id: "Cuba"
    },
    {
        name: "Dinamarca",
        id: "Dinamarca"
    },
    {
        name: "Dominica",
        id: "Dominica"
    },
    {
        name: "Ecuador",
        id: "Ecuador"
    },
    {
        name: "Egipto",
        id: "Egipto"
    },
    {
        name: "El Salvador",
        id: "El Salvador"
    },
    {
        name: "El Vaticano",
        id: "El Vaticano"
    },
    {
        name: "Emiratos arabes Unidos",
        id: "Emiratos arabes Unidos"
    },
    {
        name: "Eritrea",
        id: "Eritrea"
    },
    {
        name: "Eslovaquia",
        id: "Eslovaquia"
    },
    {
        name: "Eslovenia",
        id: "Eslovenia"
    },
    {
        name: "España",
        id: "España"
    },
    {
        name: "Estados Unidos",
        id: "Estados Unidos"
    },
    {
        name: "Estonia",
        id: "Estonia"
    },
    {
        name: "Etiopia",
        id: "Etiopia"
    },
    {
        name: "Filipinas",
        id: "Filipinas"
    },
    {
        name: "Finlandia",
        id: "Finlandia"
    },
    {
        name: "Fiji",
        id: "Fiji"
    },
    {
        name: "Francia",
        id: "Francia"
    },
    {
        name: "Gabon",
        id: "Gabon"
    },
    {
        name: "Gambia",
        id: "Gambia"
    },
    {
        name: "Georgia",
        id: "Georgia"
    },
    {
        name: "Ghana",
        id: "Ghana"
    },
    {
        name: "Gibraltar",
        id: "Gibraltar"
    },
    {
        name: "Granada",
        id: "Granada"
    },
    {
        name: "Grecia",
        id: "Grecia"
    },
    {
        name: "Guam",
        id: "Guam"
    },
    {
        name: "Guatemala",
        id: "Guatemala"
    },
    {
        name: "Guinea",
        id: "Guinea"
    },
    {
        name: "Guinea Ecuatorial",
        id: "Guinea Ecuatorial"
    },
    {
        name: "Guinea Bissau",
        id: "Guinea Bissau"
    },
    {
        name: "Guyana",
        id: "Guyana"
    },
    {
        name: "Haiti",
        id: "Haiti"
    },
    {
        name: "Honduras",
        id: "Honduras"
    },
    {
        name: "Hungria",
        id: "Hungria"
    },
    {
        name: "India",
        id: "India"
    },
    {
        name: "Indian Ocean",
        id: "Indian Ocean"
    },
    {
        name: "Indonesia",
        id: "Indonesia"
    },
    {
        name: "Iran",
        id: "Iran"
    },
    {
        name: "Iraq",
        id: "Iraq"
    },
    {
        name: "Irlanda",
        id: "Irlanda"
    },
    {
        name: "Islandia",
        id: "Islandia"
    },
    {
        name: "Israel",
        id: "Israel"
    },
    {
        name: "Italia",
        id: "Italia"
    },
    {
        name: "Jamaica",
        id: "Jamaica"
    },
    {
        name: "Japon",
        id: "Japon"
    },
    {
        name: "Jersey",
        id: "Jersey"
    },
    {
        name: "Jordania",
        id: "Jordania"
    },
    {
        name: "Kazajstan",
        id: "Kazajstan"
    },
    {
        name: "Kenia",
        id: "Kenia"
    },
    {
        name: "Kirguistan",
        id: "Kirguistan"
    },
    {
        name: "Kiribati",
        id: "Kiribati"
    },
    {
        name: "Kuwait",
        id: "Kuwait"
    },
    {
        name: "Laos",
        id: "Laos"
    },
    {
        name: "Lesoto",
        id: "Lesoto"
    },
    {
        name: "Letonia",
        id: "Letonia"
    },
    {
        name: "Libano",
        id: "Libano"
    },
    {
        name: "Liberia",
        id: "Liberia"
    },
    {
        name: "Libia",
        id: "Libia"
    },
    {
        name: "Liechtenstein",
        id: "Liechtenstein"
    },
    {
        name: "Lituania",
        id: "Lituania"
    },
    {
        name: "Luxemburgo",
        id: "Luxemburgo"
    },
    {
        name: "Macedonia",
        id: "Macedonia"
    },
    {
        name: "Madagascar",
        id: "Madagascar"
    },
    {
        name: "Malasia",
        id: "Malasia"
    },
    {
        name: "Malawi",
        id: "Malawi"
    },
    {
        name: "Maldivas",
        id: "Maldivas"
    },
    {
        name: "Mali",
        id: "Mali"
    },
    {
        name: "Malta",
        id: "Malta"
    },
    {
        name: "Marruecos",
        id: "Marruecos"
    },
    {
        name: "Mauricio",
        id: "Mauricio"
    },
    {
        name: "Mauritania",
        id: "Mauritania"
    },
    {
        name: "Mexico",
        id: "Mexico"
    },
    {
        name: "Micronesia",
        id: "Micronesia"
    },
    {
        name: "Moldavia",
        id: "Moldavia"
    },
    {
        name: "Monaco",
        id: "Monaco"
    },
    {
        name: "Mongolia",
        id: "Mongolia"
    },
    {
        name: "Montserrat",
        id: "Montserrat"
    },
    {
        name: "Mozambique",
        id: "Mozambique"
    },
    {
        name: "Namibia",
        id: "Namibia"
    },
    {
        name: "Nauru",
        id: "Nauru"
    },
    {
        name: "Nepal",
        id: "Nepal"
    },
    {
        name: "Nicaragua",
        id: "Nicaragua"
    },
    {
        name: "Niger",
        id: "Niger"
    },
    {
        name: "Nigeria",
        id: "Nigeria"
    },
    {
        name: "Noruega",
        id: "Noruega"
    },
    {
        name: "Nueva Zelanda",
        id: "Nueva Zelanda"
    },
    {
        name: "Oman",
        id: "Oman"
    },
    {
        name: "Paises Bajos",
        id: "Paises Bajos"
    },
    {
        name: "Pakistan",
        id: "Pakistan"
    },
    {
        name: "Palau",
        id: "Palau"
    },
    {
        name: "Panama",
        id: "Panama"
    },
    {
        name: "Papua Nueva Guinea",
        id: "Papua Nueva Guinea"
    },
    {
        name: "Paraguay",
        id: "Paraguay"
    },
    {
        name: "Peru",
        id: "Peru"
    },
    {
        name: "Polonia",
        id: "Polonia"
    },
    {
        name: "Portugal",
        id: "Portugal"
    },
    {
        name: "Puerto Rico",
        id: "Puerto Rico"
    },
    {
        name: "Qatar",
        id: "Qatar"
    },
    {
        name: "Reino Unido",
        id: "Reino Unido"
    },
    {
        name: "Republica Centroafricana",
        id: "Republica Centroafricana"
    },
    {
        name: "Republica Checa",
        id: "Republica Checa"
    },
    {
        name: "Republica Democratica del Congo",
        id: "Republica Democratica del Congo"
    },
    {
        name: "Republica Dominicana",
        id: "Republica Dominicana"
    },
    {
        name: "Ruanda",
        id: "Ruanda"
    },
    {
        name: "Rumania",
        id: "Rumania"
    },
    {
        name: "Rusia",
        id: "Rusia"
    },
    {
        name: "Sahara Occidental",
        id: "Sahara Occidental"
    },
    {
        name: "Samoa",
        id: "Samoa"
    },
    {
        name: "San Cristobal y Nevis",
        id: "San Cristobal y Nevis"
    },
    {
        name: "San Marino",
        id: "San Marino"
    },
    {
        name: "San Vicente y las Granadinas",
        id: "San Vicente y las Granadinas"
    },
    {
        name: "Santa Lucia",
        id: "Santa Lucia"
    },
    {
        name: "Santo Tome y Principe",
        id: "Santo Tome y Principe"
    },
    {
        name: "Senegal",
        id: "Senegal"
    },
    {
        name: "Seychelles",
        id: "Seychelles"
    },
    {
        name: "Sierra Leona",
        id: "Sierra Leona"
    },
    {
        name: "Singapur",
        id: "Singapur"
    },
    {
        name: "Siria",
        id: "Siria"
    },
    {
        name: "Somalia",
        id: "Somalia"
    },
    {
        name: "Southern Ocean",
        id: "Southern Ocean"
    },
    {
        name: "Sri Lanka",
        id: "Sri Lanka"
    },
    {
        name: "Swazilandia",
        id: "Swazilandia"
    },
    {
        name: "Sudafrica",
        id: "Sudafrica"
    },
    {
        name: "Sudan",
        id: "Sudan"
    },
    {
        name: "Suecia",
        id: "Suecia"
    },
    {
        name: "Suiza",
        id: "Suiza"
    },
    {
        name: "Surinam",
        id: "Surinam"
    },
    {
        name: "Tailandia",
        id: "Tailandia"
    },
    {
        name: "Taiwan",
        id: "Taiwan"
    },
    {
        name: "Tanzania",
        id: "Tanzania"
    },
    {
        name: "Tayikistan",
        id: "Tayikistan"
    },
    {
        name: "Togo",
        id: "Togo"
    },
    {
        name: "Tokelau",
        id: "Tokelau"
    },
    {
        name: "Tonga",
        id: "Tonga"
    },
    {
        name: "Trinidad y Tobago",
        id: "Trinidad y Tobago"
    },
    {
        name: "Tunez",
        id: "Tunez"
    },
    {
        name: "Turkmekistan",
        id: "Turkmekistan"
    },
    {
        name: "Turquia",
        id: "Turquia"
    },
    {
        name: "Tuvalu",
        id: "Tuvalu"
    },
    {
        name: "Ucrania",
        id: "Ucrania"
    },
    {
        name: "Uganda",
        id: "Uganda"
    },
    {
        name: "Uruguay",
        id: "Uruguay"
    },
    {
        name: "Uzbekistan",
        id: "Uzbekistan"
    },
    {
        name: "Vanuatu",
        id: "Vanuatu"
    },
    {
        name: "Venezuela",
        id: "Venezuela"
    },
    {
        name: "Vietnam",
        id: "Vietnam"
    },
    {
        name: "Yemen",
        id: "Yemen"
    },
    {
        name: "Djibouti",
        id: "Djibouti"
    },
    {
        name: "Zambia",
        id: "Zambia"
    },
    {
        name: "Zimbabue",
        id: "Zimbabue"

    }
];



export default class Encuesta extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            options: options , 
            value:default_values,
            selectedItems:[],
            location: null,
            errorMessage: null,
            count:null,
        };
    }

    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
        var update_values = this.state.value;
        update_values.procedencia = selectedItems[0];
        var update_options = this.state.options;
        if (update_values.procedencia == "Corrientes")
        {
            update_options = t.update(update_options, {
                fields: { 
                    viaje: { hidden: { '$set': true } },
                    // informo: { hidden: { '$set': true } },
                    motivo: { hidden: { '$set': true } },
                    alojamiento: { hidden: { '$set': true } },
                    tipoalojamiento: { hidden: { '$set': true } },
                    transporte: { hidden: { '$set': true } },
                    // gastos: { hidden: { '$set': true } },
                    informo: { hidden: { '$set': true } },
                    opinion: { hidden: { '$set': false } }
                }
            });
            // pongo valores "omitido" porque esta en corrientes
         
        }
        else
        {
            update_options = t.update(update_options, {
                fields: {
                    viaje: { hidden: { '$set': false } },
                    // informo: { hidden: { '$set': false } },
                    motivo: { hidden: { '$set': false } },
                    alojamiento: { hidden: { '$set': false } },
                    tipoalojamiento: { hidden: { '$set': false } },
                    transporte: { hidden: { '$set': false } },
                    // gastos: { hidden: { '$set': false } },
                    opinion: { hidden: { '$set': true } }
                }
            });
           
        }

        this.setState({ options: update_options, value: update_values });

        
    };
    
    _updateCount = async () => {
        let count = await AsyncStorage.getItem('count');
        count = parseInt(count) + 1;
        AsyncStorage.setItem('count', count.toString() );
        console.log("update counte");

        
    }


    saveData = async () => {
        try {
            
            nuevo = this._form.getValue(); // use that ref to get the form value
            ///get current data
            if(!nuevo){
                alert("Complete todo los campos");
                return
            }

            // validar campos opcionales
            if(nuevo.procedencia !== "Corrientes" )
            {
                if (nuevo.viaje == undefined ||
                    nuevo.motivo == undefined ||
                    nuevo.transporte == undefined ||
                    nuevo.alojamiento == undefined ||
                    nuevo.tipoalojamiento == undefined ||
                    nuevo.motivo == undefined
                    
                ) {
                    alert("Complete todo los campos");
                    return;
                }
            }
           
            
            
            
            
            



            let data = await AsyncStorage.getItem('data');
            if (data !== null)//ya hay algo cargado?
            {
                //convierto string a objeto !
                var data = JSON.parse(data);
                //nuevo objeto 
                // var nuevo = { nombre: 'ivan', apellido: 'sambrana' };
                
                //inserto nuevo objeto
                data.push(nuevo);
                //convierto de nuevo a string!
                data = JSON.stringify(data);
                //guardo en el coso locol
                AsyncStorage.setItem('data', data);
                //muestro en consola por la dua
                console.log("data")
                console.log(data);

            }
            else {//es el primero asi que se inicializa
                data = [];
                data.push(nuevo);
                AsyncStorage.setItem('data', JSON.stringify(data));
                console.log("array")
                console.log(data);

            }

            alert("Encuesta Guardada")


            this.setState({ value: null });
            this.setState({count:data.length})
            this._updateCount();
            this.props.navigation.navigate("Home")
        } catch (error) {
            console.log(error)
        }

    }
  
    onChange = (value)=>{
        var update_options = this.state.options;
        
        // como se informo del evento?
        console.log("onchange!!!!!");
        
       if(value.informo){ if(value.informo == 'otro'){
            update_options = t.update(update_options, {
                fields: { otros_informo: {  hidden: { '$set': false } } }
            });
        }
        else{
            update_options = t.update(update_options, {
                fields: { otros_informo: { hidden: { '$set': true }}
                }
            });
        }}

        /// motivo del viaje
        if (value.motivo){if (value.motivo == 'otro') {
            update_options = t.update(update_options, {
                fields: {otro_motivo: {hidden: { '$set': false }}}
            });
        }
        else {
            update_options = t.update(update_options, {
                fields: { otro_motivo: { hidden: { '$set': true }}}
            });
        }}
        /// transporte
        if(value.informo){if (value.transporte == 'otro') {
            update_options = t.update(update_options, {
                fields: { otro_transporte: { hidden: { '$set': false } } }
            });
        }
        else {
            update_options = t.update(update_options, {
                fields: { otro_transporte: { hidden: { '$set': true } } }
            });
        }}
        /// grupo familiar
        if(value.viaje){if (value.viaje == 'familia' || value.viaje == 'amigos') {
            update_options = t.update(update_options, {
                fields: { viaje_cantidad: { hidden: { '$set': false } } }
            });
        }
        else {
            update_options = t.update(update_options, {
                fields: { viaje_cantidad: { hidden: { '$set': true } } }
            });
        }
        ///autofill si es solo o pareja
            if (value.viaje == 'solo') {
                value.viaje_cantidad = 1;
            }
            if (value.viaje == 'pareja') {
                value.viaje_cantidad = 2;
            }
        }

        var d = new Date()
        value.timestamp = d.getTime()+""
       
        if (this.state.errorMessage) {
            
    } else if (this.state.location) {
      // text = JSON.stringify(this.state.location);
            value.longitud= this.state.location.coords.longitude ;
            value.latitud =     this.state.location.coords.latitude;
    }


        this.setState({ options: update_options, value: value });
        console.log(value);
    }

    ///GEO
 componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }


  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({ maximumAge : 300000});
    this.setState({ location });
    console.log("Get LOcation")
    console.log(location);
  }

  ///cout
    _getRegCount = async () => {
        let count = 0;
        let data = await AsyncStorage.getItem('data');

        if (data !== null)//ya hay algo cargado?
        {
            data = JSON.parse(data);
            count = data.length;
        }
        else {
            count = 0;
        }

        console.log(count);
        this.setState({ count: count });

    }

    render() {
        const { selectedItems } = this.state;
        return (

            <View style={styles.padre}>
              
               
                <View style={styles.header}>
                    <Image source={require('../assets/images/header.png')} style={{ height: 50, resizeMode: "contain", flex: 85 }} />
                    <TouchableOpacity style={{ height: 50, flex: 15, marginLeft: 10,textAlign:"center"}} onPress={() => this.props.navigation.navigate("Home")}>
                        <Image source={require('../assets/images/home.png')} style={{height:"90%",width:"90%"}}/>

                    </TouchableOpacity>
                    
                    
                    <Text style={{ flex: 1 }} >
                    </Text>
                </View>
                <ScrollView style={styles.scroll}>
                    <View style={styles.container}>
                       <View>
                            <Text style={{
                                fontSize: 17, marginBottom: 10,
        fontWeight: '500'}}>Residencia</Text>
                                
                        
                        </View>
                        <MultiSelect
                            hideTags
                            items={items}
                            uniqueKey="id"
                            ref={(component) => { this.multiSelect = component }}
                            onSelectedItemsChange={this.onSelectedItemsChange}
                            selectedItems={selectedItems}
                            selectText="Residencia"
                            searchInputPlaceholderText="Buscar..."
                            onChangeInput={(text) => console.log(text)}
                            // altFontFamily="ProximaNova-Light"
                            tagRemoveIconColor="#CCC"
                            tagBorderColor="#CCC"
                            tagTextColor="#CCC"
                            selectedItemTextColor="#CCC"
                            selectedItemIconColor="#CCC"
                            itemTextColor="#000"
                            displayKey="name"
                            single={true}
                            searchInputStyle={{ color: '#CCC' }}
                            submitButtonColor="#CCC"
                            submitButtonText="Submit"
                        />
                        <Form
                            ref={c => this._form = c} // assign a ref
                            type={User}
                            options={this.state.options}
                            value={this.state.value}
                            onChange={this.onChange}

                            />
                            

                      
                        <TouchableOpacity onPress={this.saveData} style={styles.button}>
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View >
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        height: 50,
        backgroundColor: "#7aba48",
        flexDirection: 'row',

    },
    scroll: {

    },
    padre: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        // backgroundColor: '#8fbd4d'

    },
    container: {
        // justifyContent: 'center',
        // flex:1,
        // marginTop: 50,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#f2f2f0',
        
        // backgroundColor: '#ffffff',
    },
    titulo: {
        // justifyContent:'center',
        textAlign: 'center',
        fontWeight: 'bold',
        color: "white",
        fontSize: 30,
        fontWeight: 'bold',
        flex: 9
    },
    button: {
        marginBottom: 30,
        // width: 260,
        alignItems: 'center',
        backgroundColor: '#8fbd4d',
        
    },
    buttonText: {
        padding: 20,
        fontSize: 24,
        color: 'white'
    }
})

// t.form.Form.stylesheet.textbox.normal.color = 'white';
// t.form.Form.stylesheet.controlLabel.normal.color ="white";
t.form.Form.stylesheet.textbox.normal.backgroundColor = "white";
t.form.Form.stylesheet.select.normal.backgroundColor = "white";

t.form.Form.stylesheet.textbox.error.backgroundColor = "white";
t.form.Form.stylesheet.select.error.backgroundColor = "white";


