import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';

const ScanQR = () => {
    const navigate = useNavigate();
    const [scanResult, setScanResult] = useState(null);
    const scannerRef = useRef(null);

    useEffect(() => {
        // Initialize scanner
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanFailure);

        function onScanSuccess(decodedText, decodedResult) {
            // Handle the scanned code as you like, for example:
            if (scanner) {
                scanner.clear().catch(error => console.error("Failed to clear scanner", error));
            }
            try {
                const data = JSON.parse(decodedText);
                if (data.sessionId) {
                    setScanResult(data.sessionId);
                    navigate(`/student/mark-attendance?sessionId=${data.sessionId}`);
                } else {
                    alert('Invalid QR Code');
                }
            } catch (e) {
                alert('Invalid QR Data');
            }
        }

        function onScanFailure(error) {
            // handle scan failure, usually better to ignore and keep scanning.
            // console.warn(`Code scan error = ${error}`);
        }

        return () => {
            scanner.clear().catch(error => {
                // Takes some time to clear sometimes, ignore
            });
        };
    }, [navigate]);

    return (
        <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Scan QR Code</h1>
            <div id="reader" className="w-full"></div>
            <p className="mt-4 text-gray-600">Point your camera at the teacher's screen to mark attendance.</p>
        </div>
    );
};

export default ScanQR;
