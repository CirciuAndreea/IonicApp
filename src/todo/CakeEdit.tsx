import React, { useContext, useEffect, useState } from 'react';
import Moment from 'moment'
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonInput,
    IonLabel,
    IonLoading,
    IonCheckbox,
    IonPage,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonIcon,
    IonActionSheet
} from '@ionic/react';
import './Style.css';
import { camera, trash, close } from "ionicons/icons";
import { getLogger } from '../core';
import { ItemContext } from './CakeProvider';
import { RouteComponentProps } from 'react-router';
import { CakeProps } from './CakeProps';
import { useNetwork } from "../utils/useNetwork";
import { Photo, usePhotoGallery } from "../utils/usePhotoGallery";
import { MyMap } from "../utils/MyMap";
import {AuthContext} from "../auth/AuthProvider";
const log = getLogger('CakeEdit');

interface ItemEditProps
    extends RouteComponentProps<{
    id?: string;
}> {}

const CakeEdit: React.FC<ItemEditProps> = ({ history, match }) => {
    const {
        items,
        saving,
        savingError,
        saveItem,
        deleteItem,
        getServerItem,
        oldItem
    } = useContext(ItemContext);
    const [name, setName] = useState('');
    const [countertops,setCountertops]=useState('');
    const [cream,setCream]=useState('');
    const [amount,setAmount]=useState(0);
    const [design,setDesign]=useState(false);
    const [photoPath, setPhotoPath] = useState("");
    const [latitude, setLatitude] = useState(46.7533824);
    const [longitude, setLongitude] = useState(23.5831296);
    const [item, setItem] = useState<CakeProps>();
    const [itemV2, setItemV2] = useState<CakeProps>();
    const [version, setVersion] = useState(-100);
    const [status, setStatus] = useState(1);
    const { networkStatus } = useNetwork();
    const {_id} = useContext(AuthContext);
    const { photos, takePhoto, deletePhoto } = usePhotoGallery();
    const [photoToDelete, setPhotoToDelete] = useState<Photo>();

    useEffect(() => {
        const routeId = match.params.id || "";
        const item = items?.find((it) => it._id === routeId);
        setItem(item);
        if (item) {
            setName(item.name);
            setCountertops(item.countertops);
            setCream(item.cream);
            setAmount(item.amount);
            setDesign(item.design);
            setStatus(item.status);
            setVersion(item.version);
            setPhotoPath(item.photoPath);
            if (item.latitude) setLatitude(item.latitude);
            if (item.longitude) setLongitude(item.longitude);
            getServerItem && getServerItem(match.params.id!, item?.version);

        }
    }, [match.params.id, items,getServerItem]);
    useEffect(() => {
        setItemV2(oldItem);
        log("SET OLD ITEM: " + JSON.stringify(oldItem));
    }, [oldItem]);
    const handleSave = () => {
        const editedItem = item
            ? {
            ...item,
                name,
                countertops,
                cream,
                amount,
                design,
                status: 0,
                version: item.version ? item.version + 1 : 1,
                photoPath,
                latitude,
                longitude
            }
            : { name,countertops,cream,amount,design, status: 0, version: 1,photoPath,
                latitude,
                longitude };
        saveItem &&
        saveItem(editedItem, networkStatus.connected).then(() => {
            //log(JSON.stringify(itemV2));
            if (itemV2 === undefined) history.goBack();
        });
    };
    const handleConflict1 = () => {
        if (oldItem) {
            const editedItem = {
                ...item,
                name,
                countertops,
                cream,
                amount,
                design,
                status: 0,
                version: oldItem?.version + 1,
                photoPath,
                latitude,
                longitude
            };
            saveItem &&
            saveItem(editedItem, networkStatus.connected).then(() => {
                history.goBack();
            });
        }
    };
    const handleConflict2 = () => {
        if (oldItem) {
            const editedItem = {
                ...item,
                name: oldItem?.name,
                countertops: oldItem?.countertops,
                cream: oldItem?.cream,
                amount: oldItem?.amount,
                design: oldItem?.design,
                status: oldItem?.status,
                version: oldItem?.version + 1,
                photoPath: oldItem?.photoPath,
                latitude: oldItem?.latitude,
                longitude: oldItem?.longitude
            };
            saveItem &&
            editedItem &&
            saveItem(editedItem, networkStatus.connected).then(() => {
                history.goBack();
            });
        }
    };
    const handleDelete = () => {
        const editedItem = item
            ? { ...item,
                name,
                countertops,
                cream,
                amount,
                design,
                status: 0,
                version: 0,
                photoPath,
                latitude,
                longitude
            }
            : {name,countertops,cream,amount,design,status: 0, version: 0,
                photoPath,
                latitude,
                longitude };
        deleteItem &&
        deleteItem(editedItem, networkStatus.connected).then(() =>
            history.goBack()
        );
    };
    return (
        <IonPage className="itemPage">
            <IonHeader >
                <IonToolbar >
                    <IonTitle>Edit</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSave}>
                            Save
                        </IonButton>
                        <IonButton onClick={handleDelete}>
                            Delete
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem>
                    <IonLabel className= "inputName">Name: </IonLabel>
                    <IonInput
                        value={name}
                        onIonChange={(e) => setName(e.detail.value || "")}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel>Countertops: </IonLabel>
                    <IonInput
                        value={countertops}
                        onIonChange={(e) => setCountertops(e.detail.value || "")}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel>Cream: </IonLabel>
                    <IonInput
                        value={cream}
                        onIonChange={(e) => setCream(e.detail.value || "")}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel>Amount: </IonLabel>
                    <IonInput
                        value={amount}
                        onIonChange={(e) => setAmount(Number(e.detail.value))}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel>Design: </IonLabel>
                    <IonCheckbox
                        checked={design}
                        onIonChange={(e) => setDesign(e.detail.checked)}
                    />
                </IonItem>
                <img src={photoPath} />
                <MyMap
                    lat={latitude}
                    lng={longitude}
                    onMapClick={(location: any) => {
                        setLatitude(location.latLng.lat());
                        setLongitude(location.latLng.lng());
                    }}
                />
                {itemV2 && (
                    <>
                        <IonItem>
                            <IonLabel>Name: {itemV2.name}</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Countertops: {itemV2.countertops}</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Cream: {itemV2.cream}</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Amount:{itemV2.amount}</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Design: </IonLabel>
                            <IonCheckbox checked={itemV2.design} disabled />
                        </IonItem>
                        <IonButton onClick={handleConflict1}>First Version</IonButton>
                        <IonButton onClick={handleConflict2}>Second Version</IonButton>
                    </>
                )}
                <IonLoading isOpen={saving} />
                {savingError && (
                    <div>{savingError.message || "Failed to save item"}</div>
                )}
                <IonFab vertical="bottom" horizontal="center" slot="fixed">
                    <IonFabButton
                        onClick={() => {
                            const photoTaken = takePhoto();
                            photoTaken.then((data) => {
                                setPhotoPath(data.webviewPath!);
                            });
                        }}
                    >
                        <IonIcon icon={camera} />
                    </IonFabButton>
                </IonFab>
                <IonActionSheet
                    isOpen={!!photoToDelete}
                    buttons={[
                        {
                            text: "Delete",
                            role: "destructive",
                            icon: trash,
                            handler: () => {
                                if (photoToDelete) {
                                    deletePhoto(photoToDelete);
                                    setPhotoToDelete(undefined);
                                }
                            },
                        },
                        {
                            text: "Cancel",
                            icon: close,
                            role: "cancel",
                        },
                    ]}
                    onDidDismiss={() => setPhotoToDelete(undefined)}
                />
            </IonContent>
        </IonPage>
    );
};

export default CakeEdit;
