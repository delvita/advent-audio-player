import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

interface EmbedCodesProps {
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
  };
  listHeight: string;
  sortAscending: boolean;
  showFirstPost: boolean;
}

export const EmbedCodes = ({ colors, listHeight, sortAscending, showFirstPost }: EmbedCodesProps) => {
  const { toast } = useToast();
  const baseUrl = window.location.origin;
  
  const getQueryString = () => {
    return `bg=${encodeURIComponent(colors.background)}&text=${encodeURIComponent(colors.text)}&primary=${encodeURIComponent(colors.primary)}&secondary=${encodeURIComponent(colors.secondary)}&height=${listHeight}&sortAsc=${sortAscending}&showFirst=${showFirstPost}`;
  };

  const iframeCode = `<iframe 
  src="${baseUrl}/embed?${getQueryString()}"
  width="100%"
  height="${parseInt(listHeight) + 400}px"
  frameborder="0"
></iframe>`;

  const jsCode = `<div id="advent-player"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${baseUrl}/embed.js';
    script.async = true;
    script.dataset.config = '${getQueryString()}';
    document.head.appendChild(script);
  })();
</script>`;

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: `${type} embed code has been copied to clipboard.`,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">iframe Embed Code</h3>
        <Card className="p-4 bg-gray-50 dark:bg-gray-900">
          <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{iframeCode}</pre>
          <Button 
            onClick={() => copyToClipboard(iframeCode, "iframe")}
            className="mt-2"
            variant="outline"
            size="sm"
          >
            Copy iframe Code
          </Button>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">JavaScript Embed Code</h3>
        <Card className="p-4 bg-gray-50 dark:bg-gray-900">
          <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{jsCode}</pre>
          <Button 
            onClick={() => copyToClipboard(jsCode, "JavaScript")}
            className="mt-2"
            variant="outline"
            size="sm"
          >
            Copy JavaScript Code
          </Button>
        </Card>
      </div>
    </div>
  );
};