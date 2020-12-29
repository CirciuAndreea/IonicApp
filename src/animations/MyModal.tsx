import React, {useEffect, useState} from 'react';
import {createAnimation, IonModal, IonButton, IonContent} from '@ionic/react';

export const MyModal: (props: { open: boolean,  showModal: any }) => JSX.Element = (props: { open: boolean,  showModal: any }) => {
    const [showModal, setShowModal] = useState(props.open);

    const enterAnimation = (baseEl: any) => {
        const backdropAnimation = createAnimation()
            .addElement(baseEl.querySelector('ion-backdrop')!)
            .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapperAnimation = createAnimation()
            .addElement(baseEl.querySelector('.modal-wrapper')!)
            .keyframes([
                {offset: 0, opacity: '0', transform: 'scale(0)'},
                {offset: 1, opacity: '0.99', transform: 'scale(1)'}
            ]);

        const imageAnimation = createAnimation()
            .addElement(baseEl.querySelector('.image')!)
            .keyframes([
                {offset: 0,opacity: '0', transform: 'scale(0)'},
                {offset: 0.5,opacity: '0.5', transform: 'scale(0.4)'},
                {offset: 1,opacity: '0.99', transform: 'scale(1)'}
            ])

        return createAnimation()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(500)
            .addAnimation([backdropAnimation, wrapperAnimation, imageAnimation]);
    }

    const leaveAnimation = (baseEl: any) => {
        return enterAnimation(baseEl).direction('reverse');
    }

    return (
        <>
            <IonModal isOpen={props.open} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                <div>
                    <h1>Bine ati venit!</h1>
                    <h4>Se prezinta urmatoarele functionalitati:</h4>
                    <p>1. Este posibila salvarea unei retete de prajituri.</p>
                    <p>2. Este posibila stergerea unei retete de prajituri.</p>
                    <p>3. Este posibila modificarea unei retete de prajituri</p>
                    <p>4. Este posibila vizualizarea imaginii cu prajitura a carei reteta este prezentata.</p>
                    <p>5. Este posibila vizualizarea hartii.</p>
                </div>
                <IonButton onClick={() => props.showModal(false)}>Close</IonButton>
            </IonModal>

        </>
    );
};
