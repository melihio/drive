import Link from "next/link"
import { ChevronLeft, Folder, FileText, Upload } from "lucide-react"
import { Button } from "~/components/ui/button"

type Item = {
  id: string
  name: string
  type: "folder" | "file"
  fileType?: "document"
}

const documentsData: Item[] = [
  { id: "2", name: "Report.docx", type: "file", fileType: "document" },
  { id: "3", name: "Presentation.pptx", type: "file", fileType: "document" },
]

export default function Documents() {
  const renderItem = (item: Item) => {
    const Icon = item.type === "folder" ? Folder : FileText

    return (
      <div key={item.id} className="mb-2">
        <Button variant="ghost" className="w-full justify-start">
          <Icon className="w-5 h-5 mr-2 text-gray-400" />
          <span>{item.name}</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-4">
        <Link href="/" passHref>
          <Button variant="ghost" className="mr-2">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Documents</h1>
      </div>
      <div className="mb-4">
        <Button>
          <Upload className="w-5 h-5 mr-2" />
          Upload
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden p-4">{documentsData.map(renderItem)}</div>
    </div>
  )
}

