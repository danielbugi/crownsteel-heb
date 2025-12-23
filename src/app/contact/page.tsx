'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '@/contexts/settings-context';
import { HeroSection } from '@/components/layout/hero-section';

export default function ContactPage() {
  const { settings } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success("Message sent successfully! We'll get back to you soon");

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again later');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'אימייל',
      value: settings?.contactEmail || 'contact@forgesteel.com',
      href: `mailto:${settings?.contactEmail || 'contact@forgesteel.com'}`,
    },
    {
      icon: Phone,
      label: 'טלפון',
      value: settings?.contactPhone || '+972-50-123-4567',
      href: `tel:${settings?.contactPhone || '+972501234567'}`,
    },
    {
      icon: MapPin,
      label: 'כתובת',
      value: settings?.address || 'רחוב ראשי 123, תל אביב, ישראל',
      href: null,
    },
    {
      icon: Clock,
      label: 'שעות פעילות',
      value: 'א׳-ה׳: 9:00-18:00',
      href: null,
    },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <HeroSection
        title="צור קשר"
        description="יש לכם שאלה? רוצים לקבוע פגישה? אנחנו כאן בשבילכם!"
        size="lg"
      />

      {/* Contact Content */}
      <section className="py-16">
        <div className="container px-4 py-4 sm:px-8 sm:py-8 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right">
            {/* Contact Info */}
            <div className="space-y-6 p-4 sm:p-6 md:p-8 bg-gray-50 rounded-lg shadow border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-right">
                פרטי התקשרות
              </h2>
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                const content = (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4 space-x-reverse">
                        <div className="p-2 bg-accent rounded-lg">
                          <Icon className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <div className="text-right">
                          <h3 className="font-semibold mb-1">{info.label}</h3>
                          <p className="text-sm text-muted-foreground">
                            {info.value}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );

                return info.href ? (
                  <a
                    key={index}
                    href={info.href}
                    className="block hover:scale-105 transition-transform"
                  >
                    {content}
                  </a>
                ) : (
                  content
                );
              })}

              {/* Map Placeholder */}
              <Card>
                <CardContent className="pt-6">
                  <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    בואו לבקר באולם התצוגה שלנו
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-2 sm:p-4 md:p-8 bg-gray-50 rounded-lg shadow border border-gray-200">
                <CardHeader className="text-right pb-2">
                  <CardTitle className="text-gray-900">
                    שלחו לנו הודעה
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-gray-800">
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 text-right"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="block text-right">
                          שם מלא <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="ישראל ישראלי"
                          className="text-right text-black"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="block text-right">
                          אימייל <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="israel@example.com"
                          className="text-right text-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="block text-right">
                          טלפון
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="050-1234567"
                          className="text-right text-black"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="block text-right">
                          נושא <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="איך נוכל לעזור?"
                          className="text-right text-black"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="block text-right">
                        הודעה <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="כתבו את ההודעה כאן..."
                        className="text-right text-black"
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} size="lg">
                      {isSubmitting ? 'שולח...' : 'שלח הודעה'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
