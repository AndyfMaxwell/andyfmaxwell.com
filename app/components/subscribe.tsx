"use client";
import { useState } from "react";
import '@/app/globals.css';
import { tasaOrbiter, } from "@/app/fonts";
import Image from "next/image";


export default function () {
    const [showSubscribe, setShowSubscribe] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState("unsubscribed");
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const payload = {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim(),
        };
        const response = await fetch("http://localhost:8000/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setSubscribed("subscribed");
      } else {
        setSubscribed("error");
      }  
    }
    const renderSubscribeButton = () => {
        if (subscribed === "unsubscribed") {
            if (!(firstName.trim() && lastName.trim() && email.trim())) {
                return <button className="subscribe-button" type="submit" disabled>Subscribe</button>
            }
            else {                
                return <button className="subscribe-button" type="submit">Subscribe</button>
            }

            return <button className="subscribe-button" onClick={() => setShowSubscribe(true)}>Subscribe</button>
        }
        else if (subscribed === "subscribed") {
            return <p className="success-message">Thanks for subscribing!</p>
        }
        else if (subscribed === "error") {
            return <p className="error-message">An error occurred.</p>
        }
    }
    return <div>
        <button className="subscribe-button" onClick={() => setShowSubscribe(true)}>Subscribe</button>
        {showSubscribe && (
            <div className="subscribe-modal-overlay">
                <div className="subscribe-modal-backdrop" onClick={() => setShowSubscribe(false)} />
                <div className="subscribe-modal">
                    <button className="x" onClick={() => setShowSubscribe(false)}>
                        <Image src={"/x.svg"} alt="close" width={20} height={20}></Image>
                    </button>
                    <div className={`${tasaOrbiter.className} subscribe-modal-content`}>
                        <form onSubmit={handleSubmit}>
                            <h2 className={`${tasaOrbiter.className} align-center`}>Get Updates on New Content & Projects!</h2>
                            <div className="half-fields">
                                <div className="half-field">
                                    <label>
                                        First Name
                                    </label>
                                    <input type="text" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className="half-field">
                                    <label>
                                        Last Name
                                    </label>
                                    <input type="text" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                            </div>
                            <div className="field">
                                <label>
                                    Email Address
                                </label>
                                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            {renderSubscribeButton()}
                        </form>
                    </div>

                </div>
            </div>
        )}
    </div>;
}