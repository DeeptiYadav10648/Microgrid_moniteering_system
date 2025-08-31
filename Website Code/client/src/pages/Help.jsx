import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Search, Book, Video, MessageCircle, ExternalLink, Download } from "lucide-react";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqItems = [
    {
      id: "1",
      question: "How do I interpret the energy flow visualization?",
      answer: "The energy flow visualization shows real-time energy movement from generation sources (solar panels and wind turbines) through the battery storage system to your household consumption. The animated lines indicate active energy transfer, and the thickness represents the amount of power flowing.",
      category: "Dashboard"
    },
    {
      id: "2", 
      question: "What does battery health percentage mean?",
      answer: "Battery health indicates the overall condition of your battery system. 90%+ is excellent, 70-89% is good, and below 70% may require maintenance. This is calculated based on charge cycles, temperature history, and capacity retention over time.",
      category: "Battery"
    },
    {
      id: "3",
      question: "How is system efficiency calculated?",
      answer: "System efficiency is calculated as (Total Energy Generation / Total Energy Consumption) × 100. Values above 100% indicate energy surplus, while below 100% means you're consuming more than generating.",
      category: "Analytics"
    },
    {
      id: "4",
      question: "What triggers system alerts?",
      answer: "Alerts are triggered by various conditions: battery levels outside normal range, high temperature readings, grid connectivity issues, or when energy generation drops significantly. You can customize alert thresholds in Settings.",
      category: "Alerts"
    },
    {
      id: "5",
      question: "How do I optimize my energy usage?",
      answer: "Use the Control Panel to set battery charge/discharge schedules, enable auto-optimization, and monitor the Household Usage page to identify high-consumption appliances. Consider shifting usage to peak generation hours.",
      category: "Optimization"
    },
    {
      id: "6",
      question: "What should I do if the grid goes offline?",
      answer: "When the grid goes offline, your system automatically switches to battery backup mode. Monitor your battery level closely and reduce non-essential consumption to extend backup time. The system will reconnect automatically when grid power is restored.",
      category: "Troubleshooting"
    }
  ];

  const trainingVideos = [
    {
      title: "Dashboard Overview",
      duration: "5:23",
      description: "Complete walkthrough of the energy dashboard interface",
      category: "Getting Started"
    },
    {
      title: "Battery Management Best Practices", 
      duration: "8:15",
      description: "Learn how to maximize battery life and performance",
      category: "Battery"
    },
    {
      title: "Setting Up Alerts and Notifications",
      duration: "4:42", 
      description: "Configure custom alerts for your energy system",
      category: "Configuration"
    },
    {
      title: "Understanding Energy Flow",
      duration: "6:18",
      description: "Deep dive into energy generation and consumption patterns",
      category: "Analytics"
    }
  ];

  const quickGuides = [
    {
      title: "Quick Start Guide",
      description: "Get up and running with your energy system in 10 minutes",
      icon: Book,
      downloadUrl: "/guides/quick-start.pdf"
    },
    {
      title: "Installation Manual",
      description: "Complete hardware installation and setup instructions", 
      icon: Book,
      downloadUrl: "/guides/installation.pdf"
    },
    {
      title: "Troubleshooting Guide",
      description: "Common issues and solutions for energy system problems",
      icon: Book, 
      downloadUrl: "/guides/troubleshooting.pdf"
    },
    {
      title: "API Documentation",
      description: "Technical documentation for developers and integrators",
      icon: Book,
      downloadUrl: "/guides/api-docs.pdf"
    }
  ];

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" data-testid="page-help">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Help & Training</h1>
        <Button variant="outline" data-testid="button-contact-support">
          <MessageCircle className="w-4 h-4 mr-2" />
          Contact Support
        </Button>
      </div>

      {/* Search */}
      <Card data-testid="card-help-search">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search help articles, FAQs, and guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-help-search"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQ Section */}
        <Card data-testid="card-faq">
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQ.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-left" data-testid={`faq-question-${item.id}`}>
                    <div className="flex items-center justify-between w-full mr-4">
                      <span>{item.question}</span>
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid={`faq-answer-${item.id}`}>
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {filteredFAQ.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Training Videos */}
        <Card data-testid="card-training-videos">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="w-5 h-5 mr-2" />
              Training Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainingVideos.map((video, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Video className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium" data-testid={`text-video-title-${index}`}>
                        {video.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {video.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {video.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {video.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" data-testid={`button-play-video-${index}`}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Guides */}
      <Card data-testid="card-quick-guides">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Book className="w-5 h-5 mr-2" />
            Documentation & Guides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickGuides.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <div key={index} className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" data-testid={`text-guide-title-${index}`}>
                        {guide.title}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {guide.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full" data-testid={`button-download-guide-${index}`}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card data-testid="card-contact-info">
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-blue-500" />
              </div>
              <h4 className="text-sm font-medium mb-2">Live Chat Support</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Get instant help from our technical support team
              </p>
              <Button variant="outline" size="sm" data-testid="button-live-chat">
                Start Chat
              </Button>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ExternalLink className="w-6 h-6 text-green-500" />
              </div>
              <h4 className="text-sm font-medium mb-2">Knowledge Base</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Browse our comprehensive online documentation
              </p>
              <Button variant="outline" size="sm" data-testid="button-knowledge-base">
                Visit KB
              </Button>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-purple-500" />
              </div>
              <h4 className="text-sm font-medium mb-2">Community Forum</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Connect with other users and share experiences
              </p>
              <Button variant="outline" size="sm" data-testid="button-community-forum">
                Join Forum
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
