import React, { useContext, useEffect, useState } from 'react';
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
    IonToolbar
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
    id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
    const { items, saving, savingError, saveItem, deleteItem } = useContext(ItemContext);
    const [name, setName] = useState('');
    const [countertops,setCountertops]=useState('');
    const [cream,setCream]=useState('');
    const [amount,setAmount]=useState(0);
    const [design,setDesign]=useState(false);
    const [item, setItem] = useState<ItemProps>();
    useEffect(() => {
        log("useEffect");
        const routeId = match.params.id || "";
        const item = items?.find((it) => it._id === routeId);
        setItem(item);
        if (item) {
            setName(item.name);
            setCountertops(item.countertops);
            setCream(item.cream);
            setAmount(item.amount);
            setDesign(item.design);
        }
    }, [match.params.id, items]);
    const handleSave = () => {
        const editedItem = item ? { ...item, name,countertops,cream,amount,design } : { name,countertops,cream,amount,design };
        saveItem && saveItem(editedItem).then(() => history.goBack());
    };
    const handleDelete = () => {
        const editItem = item
            ? { ...item,name,countertops,cream,amount,design}
            : {name,countertops,cream,amount,design};
        deleteItem && deleteItem(editItem).then(() => history.goBack());
    };
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
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
                    <IonLabel>Name: </IonLabel>
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
                <IonLoading isOpen={saving} />
                {savingError && (
                    <div>{savingError.message || 'Failed to save item'}</div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default ItemEdit;
