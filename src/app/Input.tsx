import { RefObject, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';

const DEFAULT_SOURCE = "bank";

interface SourceSelectProps {
    source?: string,
    setSource: (s: string) => void
}
function SourceSelect({source, setSource}: SourceSelectProps) {
    return (
        <Form.Group className="mb-3" controlId="exampleForm.SourceSelect">
            <Form.Label>Source</Form.Label>
            <Form.Select value={source} onChange={e => setSource(e.target.value)}>
                <option value="bank">Ålandsbanken / S-Pankki</option>
                <option value="ticketduo">TicketDuo</option>
                <option value="norwegian">Bank of Norwegian</option>
                <option value="kplussa">K-Plussa Mastercard</option>
            </Form.Select>
        </Form.Group>
    )
}

interface FileInputProps {
    selectedFile?: File | null,
    setSelectedFile: (f: File) => void,
    disabled?: boolean,
    inputRef?: RefObject<HTMLInputElement>
}
function FileInput({selectedFile, setSelectedFile, disabled, inputRef}: FileInputProps) {
    return (
        <Form.Group className="mb-3" controlId="exampleForm.FileInput">
            <Form.Label>Select a file</Form.Label>
            <Form.Control
                type="file"
                accept='.xml,.csv,.xslx'
                onChange={e => setSelectedFile(e.target.files && e.target.files[0])}
                disabled={disabled}
                ref={inputRef}
            />
        </Form.Group>
    )
}

interface PasteTextareaProps {
    pasteText?: string,
    setPasteText: (s: string) => void,
    disabled?: boolean
}
function PasteTextarea({pasteText, setPasteText, disabled}: PasteTextareaProps) {
    console.log('pasteText', pasteText);
    return (
        <Form.Group className="mb-3" controlId="exampleForm.PasteTextarea">
            <Form.Label>Paste Input</Form.Label>
            <Form.Control
                as="textarea"
                rows={10}
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                disabled={disabled}
            />
        </Form.Group>
    )
}

export default function Input({
}) {
    const [source, setSource] = useState<string>(DEFAULT_SOURCE);
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [pasteText, setPasteText] = useState<string>("");

    const selectedFileInputRef = useRef<HTMLInputElement>(null);

    const resetSelectedFile = () => {
        setSelectedFile(null)
        if (selectedFileInputRef.current) {
            selectedFileInputRef.current.value = "";
        }
    };
    const resetPasteText = () => setPasteText("");

    const onSourceChange = (newSource: string) => {
        const changed = newSource != source;
        setSource(newSource);
        if (changed) {
            resetSelectedFile();
            resetPasteText();
        }
    }

    const onSelectedFileChange = (newFile: File) => {
        const changed = newFile != selectedFile;
        setSelectedFile(newFile);
        if (changed) {
            resetPasteText();
        }
    }

    const onPasteTextChange = (newPasteText: string) => {
        const changed = newPasteText != pasteText;
        setPasteText(newPasteText);
        if (changed) {
            resetSelectedFile();
        }
    }

    console.log(source);
    console.log('state', {source, selectedFile, pasteText});

    return (
        <>
            <Form>
                <SourceSelect source={source} setSource={onSourceChange}/>
                <FileInput selectedFile={selectedFile} setSelectedFile={onSelectedFileChange} disabled={source == undefined} inputRef={selectedFileInputRef}/>
                <PasteTextarea pasteText={pasteText} setPasteText={onPasteTextChange} disabled={source == undefined}/>
            </Form>
        </>
    )
}