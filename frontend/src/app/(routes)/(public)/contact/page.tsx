import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Github, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 md:px-12 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-muted-foreground mb-8">
          Have questions about DonorDash? We&apos;d love to hear from you.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-orange-500" />
                <CardTitle className="text-base">Email</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                support@donordash.com
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Github className="h-6 w-6 text-orange-500" />
                <CardTitle className="text-base">GitHub</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <a
                href="https://github.com/vikasnsoft/donor-dash"
                className="text-sm text-orange-500 hover:underline"
              >
                github.com/vikasnsoft/donor-dash
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
