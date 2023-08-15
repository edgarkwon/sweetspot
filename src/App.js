import React, { useEffect, useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { GoogleMap, MarkerF, Circle } from '@react-google-maps/api';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress, Box, Container, TextField, Chip, Snackbar } from '@mui/material';


const App = () => {
    const allSectors = [
        '중식', '돈까스/회/일식', '양식', '분식', '고기/구이', '족발/보쌈', '치킨', '피자', '버거', '찜/탕/찌개', '백반/죽/국수', '카페/디저트', '아시안', '주점', '샐러드', '도시락/컵밥/토스트'
      ];
    const initialCounts = {};

    allSectors.forEach(
        sector => {initialCounts[sector] = 0;}
    );
      
    const [address, setAddress] = useState("");
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
    const [dataLoading, setDataLoading] = useState(false);
    const [apiData, setApiData] = useState(null);
    const [radius, setRadius] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [sectorCounts, setSectorCounts] = useState(initialCounts);
    const [sortedSectors, setSortedSectors] = useState([]);

    const getRadiusValue = (value) => {
        return value === '500m' ? 500 : 
               value === '1km' ? 1000 : 
               value === '2km' ? 2000 : 
               value === '4km' ? 4000 : 6000;
    };

    const handleRadiusClick = (value) => {
        setRadius(getRadiusValue(value));
    };

    const handleSelect = async value => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        setAddress(value);
        setCoordinates(latLng);
        console.log(String(latLng.lat)+","+String(latLng.lng));
    };

    const handleDragEnd = event => {
        setCoordinates({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        console.log(String(event.latLng.lat())+","+String(event.latLng.lng()));
    };

    const handleButtonClick = async () => {
        if (!radius) {
            setAlertOpen(true);
        } else {
            console.log(String(coordinates.lat)+","+String(coordinates.lng));
            setDataLoading(true);
            try {
                const response = await fetch("https://g32icjuk6rexrsk7iz4pjdtosa0kdorl.lambda-url.ap-northeast-2.on.aws/", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: String(coordinates.lat)+","+String(coordinates.lng)+","+String(radius)
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
        
                const data = await response.json();
                console.log(data);
                setApiData(data);
                const updatedCounts = { ...initialCounts }; // 초기 카운트 복사
                // apiData를 통해 섹터별 카운트를 업데이트합니다.
                data.forEach(place => {
                place.sector.forEach(sector => {
                    updatedCounts[sector]++;
                });
                });

                // 카운트를 업데이트하고 sortedSectors도 재정렬합니다.
                setSectorCounts(updatedCounts);
                setDataLoading(false);
            } catch (error) {
                console.error(error);
            } 
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };

    const countBySector = (data) => {
        const counts = {};
    
        data.forEach(item => {
            item.sector.forEach(sector => {
                counts[sector] = (counts[sector] || 0) + 1;
            });
        });
    
        return counts;
    }

    useEffect(() => {
        const sorted = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1]);
        setSortedSectors(sorted);
      }, [sectorCounts]);

    return (
    <Container>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={!coordinates.lat && "100vh"}>
        {!coordinates.lat && <h1 style={{ textAlign: 'center' }}>Sweetspot Recommender</h1>}
        <PlacesAutocomplete 
            value={address} 
            onChange={setAddress}
            onSelect={handleSelect}
        >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div style={{ width: '100%', maxWidth: '800px' }}>
                    <TextField 
                        {...getInputProps()} 
                        fullWidth
                        variant="outlined"
                        placeholder="주소를 입력하세요."
                        margin="normal"
                    />
                    <Box mt={1}>
                        {loading && <div>...loading</div>}
                        {suggestions.map(suggestion => {
                            const style = { 
                                backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                                padding: '5px 10px',
                                cursor: 'pointer'
                            };
                            return (
                                <div key={suggestion.placeId} {...getSuggestionItemProps(suggestion, { style })}>
                                    {suggestion.description}
                                </div>
                            );
                        })}
                    </Box>
                </div>
            )}
        </PlacesAutocomplete>

        {coordinates.lat && coordinates.lng && 
            <GoogleMap 
                mapContainerStyle={{ height: "400px", width: "800px", marginTop: '16px' }}
                zoom={15}
                center={coordinates}
            >
                <MarkerF 
                    position={coordinates} 
                    draggable={true}
                    onDragEnd={handleDragEnd}
                />
                {radius && 
                    <Circle
                        center={coordinates} 
                        radius={radius} 
                        options={{
                            strokeColor: "#FF0000",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: "#FF0000",
                            fillOpacity: 0.35,
                        }}
                    />
                }
            </GoogleMap>
        }

        {coordinates.lat && coordinates.lng &&
            <>
                <Box style={{ margin: '16px 0' }}>
                    {['500m', '1km', '2km', '4km', '6km'].map((value) => (
                        <Chip
                            key={value}
                            label={value}
                            onClick={() => handleRadiusClick(value)}
                            color={getRadiusValue(value) === radius ? "primary" : "default"}
                            variant={getRadiusValue(value) === radius ? "filled" : "outlined"}
                            style={{ margin: '0 5px' }}
                        />
                    ))}
                </Box>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleButtonClick}
                    style={{ marginTop: '16px', marginBottom: '16px'}}
                >
                    분석 시작하기
                </Button>
                <Snackbar
                    open={alertOpen}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message="분석하기 전에 반경을 선택해주세요."
                    action={
                        <>
                            <Button color="secondary" size="small" onClick={handleClose}>
                                Close
                            </Button>
                        </>
                    }
                />
            </>}
        {dataLoading && <CircularProgress style={{ marginTop: '16px'}}/>}
        </Box>
        {apiData && !dataLoading && (
    <div style={{ overflowX: 'scroll', display: 'flex', justifyContent: 'center' }}>
        <Paper style={{ minWidth: '70%', margin: '0 10px' }}>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    {sortedSectors.map((sector, index) => (
                        <span key={index} style={{ marginRight: '10px' }}>
                            {sector[0]}: {sector[1]}
                        </span>
                    ))}
            </div>
            <h2 style={{ textAlign: 'center' }}>통합 테이블</h2>
            <Table border="1">
                <TableHead>
                    <TableRow>
                        <th>Index</th>
                        <th>Name</th>
                        <th>category_name</th>
                        <th>Distance</th>
                        <th>Sector</th>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {apiData.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.place_name}</TableCell>
                            <TableCell>{item.category_name}</TableCell>
                            <TableCell>{item.distance}</TableCell>
                            <TableCell>{item.sector.join(', ')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    </div>
)}

    </Container>
    );
}

export default App;
