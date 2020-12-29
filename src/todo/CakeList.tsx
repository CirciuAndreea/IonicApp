import React, {useContext,useState, useEffect} from "react";
import { RouteComponentProps } from "react-router";
import { Redirect } from "react-router-dom";
import {MyModal} from "../animations/MyModal";
import {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSelect,
    IonSelectOption,
    IonSearchbar,createAnimation,
} from "@ionic/react";
import "./Style.css";
import { add } from "ionicons/icons";
import Cake from "./Cake";
import { getLogger } from "../core";
import { ItemContext } from "./CakeProvider";
import { AuthContext } from "../auth/AuthProvider";
import { CakeProps } from "./CakeProps";
import {MyComponent} from "../animations/MyComponent";
import { useNetwork } from "../utils/useNetwork";

const log = getLogger("CakeList");

const CakeList: React.FC<RouteComponentProps> = ({ history }) => {
    useEffect(simpleAnimation, []);
    const { items, fetching, fetchingError, updateServer

    } = useContext(ItemContext);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(
        false
    );
    const { networkStatus } = useNetwork();
    const [filter, setFilter] = useState<string | undefined>(undefined);
    const [search, setSearch] = useState<string>("");
    const [pos, setPos] = useState(16);
    const element = document.getElementsByClassName('addButton');
    element[0]?.addEventListener("onmouseover",function(){
        simpleAnimation()
    });
    const selectOptions = ["without", "with"];
    const [itemsShow, setItemsShow] = useState<CakeProps[]>([]);
    const { logout } = useContext(AuthContext);
    const handleLogout = () => {
        logout?.();
        return <Redirect to={{ pathname: "/login" }} />;
    };
    useEffect(() => {
        if (networkStatus.connected === true) {
            updateServer && updateServer();
        }
    }, [networkStatus.connected]);
    useEffect(() => {
        if (items?.length) {
            setItemsShow(items.slice(0, 16));
        }
    }, [items]);
    log("render");
    async function searchNext($event: CustomEvent<void>) {
        if (items && pos < items.length) {
            setItemsShow([...itemsShow, ...items.slice(pos, 17 + pos)]);
            setPos(pos + 17);
        } else {
            setDisableInfiniteScroll(true);
        }
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }
    useEffect(() => {
        if (filter && items) {
            const boolType = filter === "with";
            setItemsShow(items.filter((cake) => cake.design === boolType));
        }
    }, [filter,items]);

    useEffect(() => {
        if (search && items) {
            setItemsShow(items.filter((cake) => cake.name.startsWith(search)));
        }
    }, [search,items]);

    function simpleAnimation() {
        console.log('in simple')
        const el = document.querySelector('.addButton');
        if (el) {
            const animation = createAnimation()
                .addElement(el)
                .duration(1000)
                .direction('alternate')
                .iterations(Infinity)
                .keyframes([
                    {offset: 0,opacity: '0.6', transform: 'scale(0.7)'},
                    {offset: 1,opacity: '0.99', transform: 'scale(1)'}
                ])
            animation.play();
        }
    }
    const [showModal, setShowModal] = useState(false);
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle className="cakeList">Cake List</IonTitle>
                    <MyComponent/>
                    <IonButton className="showButton" onClick={() => setShowModal(true)}>Show details</IonButton>
                    <MyModal open={showModal} showModal={setShowModal}/>
                    <IonButton className="logoutButton" onClick={handleLogout}>Logout</IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonLoading isOpen={fetching} message="Fetching items" />
                <IonSearchbar
                    className="forSearch"
                    value={search}
                    debounce={1000}

                    onIonChange={(e) => {
                        if (e.detail.value!.length > 0) {
                            setSearch(e.detail.value!)
                        } else {
                            setSearch(" ")
                        }
                    }}
                ></IonSearchbar>
                <IonSelect
                    className="selction"
                    value={filter}
                    placeholder="Selection about design"
                    onIonChange={(e) => setFilter(e.detail.value)}
                >
                    {selectOptions.map((option) => (
                        <IonSelectOption key={option} value={option}>
                            {option}
                        </IonSelectOption>
                    ))}
                </IonSelect>
                <div className={"networkDiv"}>Network is {networkStatus.connected ? "online" : "offline"}</div>
                {itemsShow &&
                        itemsShow.map((cake: CakeProps) => {
                            return (
                                <Cake
                                    key={cake._id}
                                    _id={cake._id}
                                    name={cake.name}
                                    countertops={cake.countertops}
                                    cream={cake.cream}
                                    amount={cake.amount}
                                    design={cake.design}
                                    status={cake.status}
                                    version={cake.version}
                                    photoPath={cake.photoPath}
                                    latitude={cake.latitude}
                                    longitude={cake.longitude}
                                    onEdit={(id) => history.push(`/item/${id}`)}
                                />
                            );
                        })}
                        <IonInfiniteScroll
                            threshold="100px"
                            disabled={disableInfiniteScroll}
                            onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}
                        >
                            <IonInfiniteScrollContent loadingText="Loading more good doggos..."></IonInfiniteScrollContent>
                        </IonInfiniteScroll>
                        {fetchingError && (
                            <div>{fetchingError.message || "Failed to fetch items"}</div>
                        )}
                        <IonFab vertical="bottom" horizontal="end" slot="fixed">
                            <IonFabButton onClick={() => history.push("/item")}>
                                <IonIcon icon={add} />
                            </IonFabButton>
                        </IonFab>
                    </IonContent>
                </IonPage>
    );
};

export default CakeList;
