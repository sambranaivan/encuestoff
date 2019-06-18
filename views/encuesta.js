import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button,Alert, Platform,Image, AsyncStorage, TouchableOpacity} from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import t from 'tcomb-form-native';
import MultiSelect from 'react-native-multiple-select';


const Form = t.form.Form;

// // // // // // // // // // // // //
// Esto va a cambiar a cada rato
const gastos = t.enums({
    a: 'Menos de $500',
    b: 'Entre $500 y $1.000',
    c: 'Entre $1.000 y $2.000',
    d: 'Entre $2.000 y $3.000',
    e: 'Entre $3.000 y $5.000',
    f: 'Más de $5.000',
    g: 'No usaron',
    h: 'Ns/Nc',
})
const gastos_14 = t.enums({
    a: 'Menos de $500',
    b: 'Entre $500 y $1.000',
    c: 'Entre $1.000 y $2.000',
    d: 'Entre $2.000 y $3.000',
    e: 'Entre $3.000 y $5.000',
    f: 'Más de $5.000',
    g: 'No Consumieron',
    h: 'Ns/Nc',
})

const Formulario = t.struct({
    latitud:t.maybe(t.Number),///automaticos
    longitud: t.maybe(t.Number),///automaticos
    userid: t.String,
    timestamp: t.maybe(t.String),
    localidad:t.String,
    concurso:t.String,
    fecha:t.String,
    procedencia: t.String,//lugar de residencia
    cuantas_personas:t.Number,
    tipo_alojamiento:t.maybe( t.enums({ //maybe
        vivienda_propia:'Vivienda Propia',
        vivienda_familiares:'Vivienda de Familiares o Amigos',
        'Hotel':'Hotel',
        'Apart Hotel':'Apart',
        'Boutique':'Boutique',
        'Hosteria':' Hostería',
        "Residencia o Similar":'Residencia o Similar',
        "Cabaña":'Cabaña o Pesquero',
        "Carpa":'Carpa en Camping'
    }, '¿En qué tipo de alojamiento se hospedan?')),
    cuantas_noches:t.maybe(t.Number), //maybe
    gasto_alojamiento:t.maybe(t.enums({ //maybe
        a: 'Menos de $500',
        b: 'Entre $500 y $1.000',
        c: 'Entre $1.000 y $2.000',
        d: 'Entre $2.000 y $5.000',
        e: 'Entre $5.000 y $10.000',
        f: 'Más de $10.000',
        g: 'No Pagaron',
        h: 'Ns/Nc',
    })),
    cuantos_dias:t.maybe(t.enums({//maybe
        uno:'Solo una',dos:'Dos',tres: 'Tres',cuatro: 'Cuatro',cinco: 'Cinco'
    })),
    cuantas_participo:t.enums({
        una:'Una',dos:'Dos',tres_cuatro:'Tres o Cuatro',cinco_nueve:'Cinco a Nueve',diez_mas:'Diez o más',nunca:'Nunca'
    }),
    informo:t.maybe(t.enums({//maybe
        revista:"Revistas especializadas",
        web:"Páginas Web/ Foros especializados",
        publicidad:"Por avisos publicitarios en diarios/radios/TV/Revistas",
        familia:"Comentarios de conococidos/familiares/amigos",
        club_pesca:"Club de Pesca",
        pena_pesca:"Peña de pesca",
        internet:"Redes Sociales",
    })),
    // Pregunta 9 tabla
    gasto_salida: gastos,
    uso_guia:t.enums({
        'Si': 'Sí', 'No': 'No'
    }),

    participo_pesca: t.enums({
        esta_provincia: 'En esta provincia',
        otra_provincia: 'En otras provincias',
        ambas:'En esta y en otras provincias',
        no_participo: 'No participó de otros concursos'
    }),

    // 11.
    modalidad_pesca: t.enums({
        "Bait casting":"Bait casting",
        "Spinning":"Spinning",
        "Trolling":"Trolling",
        "Fly Fishing":"Fly Fishing",
        "Con Carnada":"Con Carnada"

    }),
    // 12.De que actividades vinculadas al concurso participó o pinsar participar?
    actividad_cena: t.enums({
        'Si':'Si','No':'No','No hay':'No hay'
    }),
    // 12.De que actividades vinculadas al concurso participó o pinsar participar?
    actividad_show: t.enums({
        'Si': 'Si', 'No': 'No', 'No hay': 'No hay'
    }),
    // 12.De que actividades vinculadas al concurso participó o pinsar participar?
    actividad_exposicion: t.enums({
        'Si': 'Si', 'No': 'No', 'No hay': 'No hay'
    }),
    // 12.De que actividades vinculadas al concurso participó o pinsar participar?
    actividad_feria: t.enums({
        'Si': 'Si', 'No': 'No', 'No hay': 'No hay'
    }),
    // 12.De que actividades vinculadas al concurso participó o pinsar participar?
    // actividad_: t.enums({
    //     'Si': 'Si', 'No': 'No', 'No hay': 'No hay'
    // }),
    // 13.
    volveria:t.enums({
        'Muy probable':'Muy probable',
        'Probable':'Probable',
        'Poco Probable':'Poco Probable',
        'Nada Probable':'Nada Probable'
    }),

    // 14.
    gastos_alimentos: t.maybe(gastos_14),//maybe
    gastos_artesanias: t.maybe(gastos_14),//maybe
    // gastos_equipo_pesca: gastos_14,
    // gastos_excursiones: gastos_14,
    gastos_transporte: t.maybe(gastos_14),//maybe
    // 15.
    volveria_visitar:t.maybe(t.enums({//maybe
        'Si':'Si','No':'No'
    })),
    volveria_porque:t.maybe(t.String),//maybe
    //16 tabla
    evalua_alojamiento:t.maybe(t.enums({///maybe
        a:'Muy Buena',
        b: 'Buena',
        c: 'Regular',
        d: 'Mala',
        e: 'Muy Mala',
        z: 'No Usó'
    })),
    evalua_gastronomia: t.maybe(t.enums({//tmaybe
        a: 'Muy Buena',
        b: 'Buena',
        c: 'Regular',
        d: 'Mala',
        e: 'Muy Mala',
        z: 'No Usó'
    })),
    evalua_info_turistica: t.maybe(t.enums({//tmaybe
        a: 'Muy Buena',
        b: 'Buena',
        c: 'Regular',
        d: 'Mala',
        e: 'Muy Mala',
        z: 'No Usó'
    })),
    evalua_excursiones:t.maybe(t.enums({//tmaybe
        a:'Muy Buena',
        b: 'Buena',
        c: 'Regular',
        d: 'Mala',
        e: 'Muy Mala',
        z:'No Usó'
    })),
    evalua_limpieza:t.maybe( t.enums({//tmaybe
        a: 'Muy Buena',
        b: 'Buena',
        c: 'Regular',
        d: 'Mala',
        e: 'Muy Mala',

    })),
    evalua_seguridad:t.maybe( t.enums({//tmaybe
        a: 'Muy Buena',
        b: 'Buena',
        c: 'Regular',
        d: 'Mala',
        e: 'Muy Mala',
 
    })),
    evalua_naturaleza:t.maybe( t.enums({//tmaybe
        a: 'Muy Buena',
        b: 'Buena',
        c: 'Regular',
        d: 'Mala',
        e: 'Muy Mala',
    })),
    evalua_accesso:t.maybe( t.enums({//tmaybe
        a: 'Muy Buena',
        b: 'Buena',
        c: 'Regular',
        d: 'Mala',
        e: 'Muy Mala',
    }))




});

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!

var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd;
}
if (mm < 10) {
    mm = '0' + mm;
}
var today = dd + '/' + mm + '/' + yyyy;
// document.getElementById('DATE').value = today

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
        // labels
        localidad:{
            label:'Localidad del concurso',editable:false
        },
        fecha:{
            label:'Fecha del concurso',editable:false
        },
        concurso: {
            label: 'Nombre del concurso', editable:false
        },
        gastos_salida:{
            label: '¿Cuanto Gasto o estima que gastara su Equipo en la Salida de Pesca?'
        },
        uso_guia:{
            label: '¿Contrató guia de pesca?'
        },
        cuantas_personas:{
            label:'¿Cuantas personas conforman el equipo?'
        },
        tipo_alojamiento:{
            label:'¿En qué tipo de alojamiento se hospedan?'
        },
        cuantas_noches:{
            label:'¿Cuantas noches pasarán alojados en esta localidad en este viaje?'
        },
        gasto_alojamiento:{
            label:'¿Cuanto gasto en alojamiento por dia?'
        },
        cuantos_dias:{
            label:'¿Cuántos días han venido para participar del concurso o de otras actividades asociadas?'
        },
        cuantas_participo:{
            label:'¿Cuántas veces participo en el concurso?'
        },
        informo:{
            label:'¿Como se entero de este concurso?'
        },
        gasto_inscripcion: {
            label:'¿Cuanto gasto en Inscripcion?'
        },
        gasto_carnada: {
            label:'... en Carnada Viva?'
        },
        gasto_combustible: {
            label:'... en Combustible para lancha?'
        },
        gasto_guia: {
            label:'... en Guía de pesca?'
        },
        gasto_comida: {
            label:'... en Comida o evento central?'
        },
        gasto_licencia_pesca: {
            label:'... en Licencia de pesca?'
        },
        participo_pesca: {
            label: '¿Ud. ha Participado en otros concursos de pesca?'
        },
        modalidad_pesca: {
            label: '¿Cuál es su modalidad de pesca preferida?'
        },
        // 12.
        actividad_cena:{
            label:'¿Participó o piensa participar de la Cena/Almuerzo de premiación?'
        },
        actividad_show: {
            label: '¿Participó o piensa participar del Show?'
        },
        actividad_exposicion: {
            label: '¿Participó o piensa participar de la Exposición?'
        },
        actividad_feria: {
            label: '¿Participó o piensa participar de la Feria Artesanal?'
        },
        // 13
        volveria:{
            label:'¿Volvería a participar de este concurso el año que viene?'
        },
        gastos_alimentos:{
            label:'¿Cuanto gastó o estima que gastaran en Productos Alimenticios?'
        },
        gastos_artesanias: {
            label: '¿Cuanto gastó o estima que gastaran en Artesanías y Souvenirs?'
        },
        gastos_equipo_pesca: {
            label: '¿Cuanto gastó o estima que gastaran en Equipos y Articulos de Pesca?'
        },
        gastos_excursiones: {
            label: '¿Cuanto gastó o estima que gastaran en Excursiones, entrada a predios, o espectáculos?'
        },
        gastos_transporte: {
            label: '¿Cuanto gastó o estima que gastaran en Transporte Local?'
        },
        volveria_porque:{
            label:'¿Por que?',hidden:true
        },
        //15
        volveria_visitar:{
            label: '¿Volveria a visitar esta localidad?'
        },
        // 16 talba
        evalua_alojamiento:{
            label:'¿Como evalúa la Oferta de Alojamiento de esta localidad?'
        },
evalua_gastronomia:{
    label:'¿Como evalúa la Oferta de Gastronómica de esta localidad?'
},
evalua_info_turistica:{
    label:'¿Como evalúa la información Turistica de esta localidad?'
},
evalua_excursiones:{
    label:'¿Como evalúa las Excursiones y Paseos de esta localidad?'
},
evalua_limpieza:{
    label:'¿Como evalúa la Limpieza en lugares públicos de esta localidad?'
},
evalua_seguridad:{
    label:'¿Como evalúa la Seguridad esta localidad?'
},
evalua_naturaleza:{
    label:'¿Como evalúa el Cuidado de la Naturaleza de esta localidad?'
},
evalua_accesso:{
    label:'¿Como evalúa el acceso a la Localidad?'
},
gasto_salida:{
    label:'¿Cuanto gastó o estima que gastará en la Salida de Pesca?'
}


        



    }
};

var default_values = {
    userid: Constants.installationId,
    procedencia: null,
    latitud:null,
    longitud:null,
    localidad:'Goya',
    fecha:today,
    concurso:'Fiesta Nacional del Surubí 2019'
}
//  
// // // // // // // // // // // // 



// listado de provincias y paises
const list_procedencias = [
    { name: "Goya", id: "Goya" },
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
    { name: "Esquina", id: "Esquina" },
    { name: "Empedrado", id: "Empedrado" },
    { name: "Estación Torrent", id: "Estación Torrent" },
    { name: "Felipe Yofre", id: "Felipe Yofre" },
    { name: "Garabí", id: "Garabí" },
    { name: "Garruchos", id: "Garruchos" },
    { name: "Gobernador Martinez", id: "Gobernador Martinez" },
    { name: "Gobernador V. Virasoro", id: "Gobernador V. Virasoro" },
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

    // campos condicionales segun procedencia
    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
        var update_values = this.state.value;
        update_values.procedencia = selectedItems[0];
        var update_options = this.state.options;
        if (update_values.procedencia == "Esquina")
        {
            update_options = t.update(update_options, {
                fields: { 
                    // informo: { hidden: { '$set': true } },
                tipo_alojamiento: { hidden: { '$set': true } },
                cuantas_noches: { hidden: { '$set': true } },
                gasto_alojamiento: { hidden: { '$set': true } },
                cuantos_dias: { hidden: { '$set': true } },
                informo: { hidden: { '$set': true } },
                volveria_visitar: { hidden: { '$set': true } },
                volveria_porque: { hidden: { '$set': true } },
                evalua_alojamiento: { hidden: { '$set': true } },
                evalua_excursiones: { hidden: { '$set': true } },
                evalua_limpieza: { hidden: { '$set': true } },
                evalua_seguridad: { hidden: { '$set': true } },
                evalua_naturaleza: { hidden: { '$set': true } },
                evalua_accesso: { hidden: { '$set': true } },
                }
            });
            // pongo valores "omitido" porque esta en corrientes
        }
        else
        {
            update_options = t.update(update_options, {
                fields: {
                    tipo_alojamiento: { hidden: { '$set': false } },
                    cuantas_noches: { hidden: { '$set': false } },
                    gasto_alojamiento: { hidden: { '$set': false } },
                    cuantos_dias: { hidden: { '$set': false } },
                    informo: { hidden: { '$set': false } },
                    volveria_visitar: { hidden: { '$set': false } },
                    volveria_porque: { hidden: { '$set': false } },
                    evalua_alojamiento: { hidden: { '$set': false } },
                    evalua_excursiones: { hidden: { '$set': false } },
                    evalua_limpieza: { hidden: { '$set': false } },
                    evalua_seguridad: { hidden: { '$set': false } },
                    evalua_naturaleza: { hidden: { '$set': false } },
                    evalua_accesso: { hidden: { '$set': false } },
                }
            });
        }
        this.setState({ options: update_options, value: update_values });
    };
    
    /**
     * ACTUALIZO CONTADOR DE ENCUESTA (se llama cada 10 segundos*)
     */
    _updateCount = async () => {
        let count = await AsyncStorage.getItem('count');
        count = parseInt(count) + 1;
        AsyncStorage.setItem('count', count.toString() );
        console.log("update counter");
    }


    /**
     * GUARDAR DATOS EN LOCAL
     */
    saveData = async () => {
        try {
            
            nuevo = this._form.getValue(); // use that ref to get the form value
            ///get current data
            if(!nuevo){
                alert("Complete todo los campos");
                return
            }

            // Comprobar Valores condicionales si estan completos
            if(nuevo.procedencia !== "Esquina" )
            {
                if (
                nuevo.tipo_alojamiento == undefined ||
                nuevo.cuantas_noches == undefined ||
                nuevo.gasto_alojamiento == undefined ||
                nuevo.cuantos_dias == undefined ||
                nuevo.informo == undefined ||
                nuevo.volveria_visitar == undefined ||
                // nuevo.volveria_porque == undefined ||
                nuevo.evalua_alojamiento == undefined ||
                nuevo.evalua_excursiones == undefined ||
                nuevo.evalua_limpieza == undefined ||
                nuevo.evalua_seguridad == undefined ||
                nuevo.evalua_naturaleza == undefined ||
                nuevo.evalua_accesso == undefined                    
                ) 
                {
                    alert("Complete todo los campos.");
                    return;
                }
            }
           
            
            
            let data = await AsyncStorage.getItem('data');// obtengo registros guardados anteriormente
            if (data !== null)//ya hay algo cargado?
            {
                //convierto string a objeto !
                var data = JSON.parse(data);
                //nuevo objeto 
                // var nuevo = { nombre: 'ivan', apellido: 'sambrana' };///se crea al inicio del metodos
                
                //inserto nuevo objeto
                data.push(nuevo);
                //convierto de nuevo a string!
                data = JSON.stringify(data);
                //guardo en el coso locol
                AsyncStorage.setItem('data', data);
                //muestro en consola por la dua
                console.log("data: ")
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


            this.setState({ value: null });//TODO no me acuerdo para que puse
            this.setState({count:data.length})//actualizo contador FORCED
            this._updateCount();
            this.props.navigation.navigate("Home")//vuelvo a Home
        } catch (error) {
            console.log(error)
        }

    }

    /** 
     * Evento ONCHANGE en CUALQUIER elemento del FORM
    */
  
    onChange = (value)=>{
        var update_options = this.state.options;
        
        console.log("onchange!!!!!");
        
            // SNIPPED: activar campos OTROS
        if (value.volveria_visitar) {
            if (value.volveria_visitar == 'No'){
                update_options = t.update(update_options, {
                    fields: { volveria_porque: {  hidden: { '$set': false } } }
                });
            }
            else{
                update_options = t.update(update_options, {
                    fields: {
                        volveria_porque: { hidden: { '$set': true }}
                    }
                });
            }}

        

        var d = new Date()
        value.timestamp = Math.round(d.getTime()/1000)+""//obtiene el timestamp en microsegundo /1000 milisegundos
       
        if (this.state.errorMessage) 
        {
                // si no hay permisos de geo pues no hago nada toma por defecto los null
        } else if (this.state.location) {
            // text = JSON.stringify(this.state.location);
            value.longitud=    this.state.location.coords.longitude ;
            value.latitud =     this.state.location.coords.latitude;
        }


        this.setState({ options: update_options, value: value });///actualizo todo
        console.log(value);
    }

    /**
     * ONLOAD pedir permisos de GEO
     */
 componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }

  }

  /**
   * OBTENER GEO
   */
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({ maximumAge : 300000});//cada 5 minutos
    this.setState({ location });
    console.log("Get LOcation")
    console.log(location);
  }

  /**
   * Cantidad de registros en memoria
   */
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
        fontWeight: '500'}}>Lugar de Residencia</Text>
                                
                        
                        </View>
                        <MultiSelect
                            hideTags
                            items={list_procedencias}
                            uniqueKey="id"
                            ref={(component) => { this.multiSelect = component }}
                            onSelectedItemsChange={this.onSelectedItemsChange}
                            selectedItems={selectedItems}
                            selectText="Lugar de Residencia"
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
                            type={Formulario}
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


