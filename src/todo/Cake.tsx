import React, {useEffect, useState} from 'react';
import {IonButton, IonItem, IonLabel } from '@ionic/react';
import { CakeProps } from './CakeProps';
import {MyModal} from "../animations/MyModal";
import {randomBytes} from "crypto";

interface CakePropsExt extends CakeProps {
    onEdit: (_id?: string) => void;
}

const Cake: React.FC<CakePropsExt> = ({ _id, name,amount,photoPath, onEdit }) => {
    return (
        <IonItem>
            <IonLabel onClick={() => onEdit(_id)}>{name} - {amount}kg </IonLabel>
            <img src={photoPath} style={{ height: 50 , width: 80, marginLeft:10}}  alt="image"/>
        </IonItem>
    );
};

export default Cake;
