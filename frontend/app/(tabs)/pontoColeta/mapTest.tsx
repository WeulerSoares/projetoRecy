// Está página deve ser deleta depois que o uso dos mapas estiver funcional, ELA É APENAS PARA EXEMPLO

// import { View, StyleSheet, Text, TouchableOpacity, TextInput } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import { requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject, watchPositionAsync, LocationAccuracy } from "expo-location";
// import * as Location from 'expo-location';
// import { useEffect, useState, useRef } from "react";
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import axios from 'axios';
// import Alert from "@/components/Alert"

// export default function MapTest() {

//     const mapRef = useRef<MapView>(null)

//     const [showAlert, setShowAlert] = useState(false);
//     const [alertMessage, setAlertMessage] = useState('');
    
//     const [location, setLocation] = useState<LocationObject | null>(null);
//     const [address, setAddress] = useState<string | null>(null);

//     const [cep, setCep] = useState('')
//     const [rua, setRua] = useState('')
//     const [numero, setnNumero] = useState('')
//     const [bairro, setBairro] = useState('')
//     const [cidade, setCidade] = useState('')
//     const [estado, setEstado] = useState('')


//     async function requestLocationPermissions() {
//         const { granted } = await requestForegroundPermissionsAsync();

//         if (granted) {
//             const currentPosition = await getCurrentPositionAsync();
//             setLocation(currentPosition)
//         }
//     }

//     useEffect(() => {
//         requestLocationPermissions();
//     }, []);

//     useEffect(() => {
//         watchPositionAsync({
//             accuracy: LocationAccuracy.Highest,
//             timeInterval: 1000,
//             distanceInterval: 1
//         }, (response) => {
//             setLocation(response);
//             mapRef.current?.animateCamera({
//                 pitch: 70,
//                 center: response.coords
//             })
//         });
//     }, []);

//     // const reverseGeoCode = async () => {

//     //     const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location?.coords.latitude}&lon=${location?.coords.longitude}`;

//     //     try {
//     //         const response = await fetch(url);
//     //         const data = await response.json();
//     //         // console.log(data.display_name)
//     //         //   return data.display_name || 'Endereço não encontrado';
//     //         const foundAddress = data.display_name || 'Endereço não encontrado';
//     //         setAddress(foundAddress); // Atualiza o estado do endereço
//     //     } catch (error) {
//     //         console.error('Erro ao buscar endereço:', error);
//     //         return null;
//     //     }


//     //     // const reverse = await Location.reverseGeocodeAsync({
//     //     //     longitude: longitude,
//     //     //     latitude: latitude
//     //     // });

//     //     // return reverse;


//     //     // const apiKey = 'ee5a4d16532a42bd945d9eb310168cf4';
//     //     // const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

//     //     // try {
//     //     //     const response = await axios.get(url);
//     //     //     const data = response.data as { results: Array<{ formatted: string }> };
//     //     //     // console.log(data.results[0].formatted)
//     //     //     return data.results[0].formatted || 'Endereço não encontrado';
//     //     // } catch (error) {
//     //     //     console.error('Erro ao buscar endereço:', error);
//     //     //     return null;
//     //     // }
//     // }

//     const reverseGeoCode = async () => {
//         if (!location) {
//             setShowAlert(true);
//             setAlertMessage('Localização não encontrada.');
//             return;
//         }

//         const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.coords.latitude}&lon=${location.coords.longitude}`;

//         try {
//             const response = await fetch(url, {
//                 headers: {
//                     'User-Agent': 'MapTestApp/1.0 (contact@example.com)'
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }

//             const data = await response.json();
//             console.log(data.address);
//             // const foundAddress = data.display_name;
//             // setAddress(foundAddress)

//             // const partes = foundAddress.split(',').map((parte: string) => parte.trim())
//             // console.log({
//             //     partes: partes,
//             //     total: partes.length
//             // });

//             setCep(data.address.postcode)
//             setRua(data.address.road)
//             setBairro(data.address.neighbourhood || data.address.city_district )
//             setCidade(data.address.city)
//             setEstado(data.address.state)

//         } catch (error) {
//             console.error('Erro ao buscar endereço:', error);
//             setAddress('Erro ao buscar endereço');
//         }
//     };



//     return (
//         <View style={styles.container}>
//             <TouchableOpacity style={styles.locationButton} onPress={reverseGeoCode}>
//                 <Text style={styles.locationButtonText}>Usar a localização atual</Text>
//             </TouchableOpacity>

//             {address && (
//                 <Text style={styles.addressText}>Endereço: {address}</Text>
//             )}

//             <TextInput
//                 style={styles.input}
//                 placeholder="CEP"
//                 placeholderTextColor="#E2E2E2"
//                 value={cep}
//                 onChangeText={setCep}
//             ></TextInput>
//             <TextInput
//                 style={styles.input}
//                 placeholder="Rua"
//                 placeholderTextColor="#E2E2E2"
//                 value={rua}
//                 onChangeText={setRua}
//             ></TextInput>
//             <TextInput
//                 style={styles.input}
//                 placeholder="Número"
//                 placeholderTextColor="#E2E2E2"
//                 value={numero}
//                 onChangeText={setnNumero}
//             ></TextInput>
//             <TextInput
//                 style={styles.input}
//                 placeholder="Bairro"
//                 placeholderTextColor="#E2E2E2"
//                 value={bairro}
//                 onChangeText={setBairro}
//             ></TextInput>
//             <TextInput
//                 style={styles.input}
//                 placeholder="Cidade"
//                 placeholderTextColor="#E2E2E2"
//                 value={cidade}
//                 onChangeText={setCidade}
//             ></TextInput>
//             <TextInput
//                 style={styles.input}
//                 placeholder="CEP"
//                 placeholderTextColor="#E2E2E2"
//                 value={estado}
//                 onChangeText={setEstado}
//             ></TextInput>

//             {showAlert && (
//                 <Alert
//                     message={alertMessage}
//                     onClose={() => setShowAlert(false)}
//                 />
//             )}
//         </View>
//     )
// }

// //     {
// //         location && <MapView
// //             style={styles.map}
// //             initialRegion={{
// //                 latitude: location.coords.latitude,
// //                 longitude: location.coords.longitude,
// //                 latitudeDelta: 0.005,
// //                 longitudeDelta: 0.005
// //             }} >
// //             <Marker coordinate={{
// //                 latitude: location.coords.latitude,
// //                 longitude: location.coords.longitude,
// //             }} />
// //         </MapView>

// //         // <MapView></MapView>
// //     }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'red',
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     map: {
//         flex: 1,
//         width: '100%'
//     },
//     locationButton: {
//         backgroundColor: '#9fe69f',
//         borderRadius: 25,
//         paddingVertical: 12,
//         paddingHorizontal: 24,
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     locationButtonText: {
//         color: '#000000',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     addressText: {
//         marginTop: 20,
//         fontSize: 16,
//         color: '#333333',
//         textAlign: 'center',
//         paddingHorizontal: 20,
//     },
//     input: {
//         backgroundColor: '#86C386',
//         borderColor: '#000000',
//         borderWidth: 1,
//         borderRadius: 8,
//         paddingVertical: 12,
//         paddingHorizontal: 16,
//         fontSize: 16,
//         color: 'white',
//         marginBottom: 25,
//       }
// });
