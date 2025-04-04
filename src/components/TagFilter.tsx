
import React from 'react';
import { useLinks } from '@/contexts/LinkContext';
import { Badge } from "@/components/ui/badge";
import { Tag } from 'lucide-react';
import { TAG_COLORS } from '@/types';

export const TagFilter = () => {
  const { tags, selectedTags, toggleTagSelection } = useLinks();
  
  if (tags.length === 0) {
    return null;
  }

  // Get color for a tag, or use default if not found
  const getTagColor = (tag: string) => {
    return TAG_COLORS[tag] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
  };

  return (
    <div className="mb-4 bg-white p-4 rounded-lg shadow-sm border border-border">
      <div className="flex items-center mb-2">
        <Tag className="h-4 w-4 mr-2 text-gray-700" />
        <span className="text-sm font-medium text-gray-700">Filter by tags</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const { bg, text, border } = getTagColor(tag);
          const isSelected = selectedTags.includes(tag);
          
          return (
            <Badge 
              key={tag}
              id={`tag-filter-${tag}`}
              variant="outline"
              className={`cursor-pointer ${isSelected ? 'ring-2 ring-ring ring-offset-1' : ''} ${isSelected ? bg : 'bg-transparent'} ${isSelected ? text : 'text-muted-foreground'} ${border}`}
              onClick={() => toggleTagSelection(tag)}
            >
              {tag}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
