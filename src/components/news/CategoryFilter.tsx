import { motion } from "framer-motion";
import { NewsCategory } from "@/lib/news-data";

interface CategoryFilterProps {
  categories: NewsCategory[];
  selectedCategory: NewsCategory | "All";
  onCategoryChange: (category: NewsCategory | "All") => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  const getCategoryColor = (category: string, isSelected: boolean) => {
    if (!isSelected) {
      return "bg-secondary text-muted-foreground hover:bg-secondary/80";
    }
    
    const colors: Record<string, string> = {
      "Smart Cities": "bg-leaf/20 text-leaf border-leaf/30",
      "Urban Mobility": "bg-primary/20 text-primary border-primary/30",
      "Infrastructure": "bg-olive/20 text-olive border-olive/30",
      "Sustainability": "bg-leaf/20 text-leaf border-leaf/30",
      "Governance & Policy": "bg-primary/20 text-primary border-primary/30",
      "Technology in Cities": "bg-olive/20 text-olive border-olive/30",
    };
    
    return colors[category] || "bg-primary/20 text-primary border-primary/30";
  };

  return (
    <div className="flex flex-wrap gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onCategoryChange("All")}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
          selectedCategory === "All"
            ? "bg-primary/20 text-primary border-primary/30"
            : "bg-secondary text-muted-foreground border-transparent hover:bg-secondary/80"
        }`}
      >
        All
      </motion.button>
      
      {categories.map((category) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${getCategoryColor(
            category,
            selectedCategory === category
          )}`}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
};
