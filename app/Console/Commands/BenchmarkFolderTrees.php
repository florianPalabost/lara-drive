<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\BenchFolder;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

// For nested set model

class BenchmarkFolderTrees extends Command
{
    protected $signature = 'benchmark:folders';

    protected $description = 'Benchmark folder nesting strategies and generate a Markdown report';

    public function handle(): void
    {
        $this->info('Running folder nesting benchmarks...');

        $results = [];

        $results['Adjacency List'] = $this->benchmarkAdjacency();
        $results['Materialized Path'] = $this->benchmarkMaterializedPath();
        $results['Nested Set'] = $this->benchmarkNestedSet();

        $markdown = $this->generateMarkdown($results);
        Storage::put('benchmark_report.md', $markdown);

        $this->info('Benchmark complete. Report saved to storage/app/benchmark_report.md');
    }

    protected function benchmarkAdjacency(): array
    {
        DB::table('adjacency_folders')->truncate();

        $start = microtime(true);
        $this->insertAdjacencyTree(10000);
        $insertTime = microtime(true) - $start;

        $start = microtime(true);
        $this->fetchAdjacencySubtree();
        $fetchTime = microtime(true) - $start;

        return [
            'insert_time' => $insertTime,
            'fetch_time'  => $fetchTime,
            'notes'       => '10,000 folders using adjacency list.',
        ];
    }

    protected function benchmarkMaterializedPath(): array
    {
        DB::table('materialized_path_folders')->truncate();

        $start = microtime(true);
        $this->insertMaterializedTree(10000);
        $insertTime = microtime(true) - $start;

        $start = microtime(true);
        $this->fetchMaterializedPathSubtree();
        $fetchTime = microtime(true) - $start;

        return [
            'insert_time' => $insertTime,
            'fetch_time'  => $fetchTime,
            'notes'       => '10,000 folders using materialized path.',
        ];
    }

    protected function benchmarkNestedSet(): array
    {
        DB::table('nested_set_folders')->truncate();

        $start = microtime(true);
        $this->insertNestedSetTree();
        $insertTime = microtime(true) - $start;

        $start = microtime(true);
        $this->fetchNestedSetSubtree();
        $fetchTime = microtime(true) - $start;

        return [
            'insert_time' => $insertTime,
            'fetch_time'  => $fetchTime,
            'notes'       => '10,000 folders using nested set (kalnoy/nestedset).',
        ];
    }

    protected function insertAdjacencyTree($max = 10000): void
    {
        $id = 1;
        $queue = [[null, 1]];

        while (! empty($queue) && $id <= $max) {
            [$parentId, $level] = array_shift($queue);

            for ($i = 1; $i <= 10 && $id <= $max; $i++) {
                $name = 'BenchFolder ' . ($parentId ?: 'root') . ".{$i}";
                $newId = DB::table('adjacency_folders')->insertGetId([
                    'name'      => $name,
                    'parent_id' => $parentId,
                ]);

                if ($level < 4) {
                    $queue[] = [$newId, $level + 1];
                }
                $id++;
            }
        }
    }

    protected function fetchAdjacencySubtree(): void
    {
        $root = DB::table('adjacency_folders')->orderByDesc('id')->first();
        $descendants = $this->getAdjacencyDescendants($root->id);
    }

    protected function getAdjacencyDescendants($parentId): Collection
    {
        $children = DB::table('adjacency_folders')->where('parent_id', $parentId)->get();
        $descendants = collect();

        foreach ($children as $child) {
            $descendants->push($child);
            $descendants = $descendants->merge($this->getAdjacencyDescendants($child->id));
        }

        return $descendants;
    }

    protected function insertMaterializedTree($max = 10000): void
    {
        $id = 1;
        $queue = [['', 1]];

        while (! empty($queue) && $id <= $max) {
            [$parentPath, $level] = array_shift($queue);

            for ($i = 1; $i <= 10 && $id <= $max; $i++) {
                $path = $parentPath . $id . '/';
                $name = 'BenchFolder ' . trim($path, '/');

                DB::table('materialized_path_folders')->insert([
                    'name' => $name,
                    'path' => $path,
                ]);

                if ($level < 4) {
                    $queue[] = [$path, $level + 1];
                }

                $id++;
            }
        }
    }

    protected function fetchMaterializedPathSubtree(): void
    {
        $node = DB::table('materialized_path_folders')->orderByDesc('id')->first();
        $path = $node->path;
        DB::table('materialized_path_folders')->where('path', 'like', "{$path}%")->get();
    }

    protected function insertNestedSetTree(): void
    {
        $root = new BenchFolder(['name' => 'Root BenchFolder']);
        $root->setTable('nested_set_folders');
        $root->save();

        $this->nestedSetInsert($root, 2);
    }

    protected function nestedSetInsert($parent, $level, $maxLevel = 4): void
    {
        if ($level > $maxLevel) {
            return;
        }

        for ($i = 1; $i <= 10; $i++) {
            $folder = new BenchFolder(['name' => "BenchFolder Level {$level} - {$i}"]);
            $folder->setTable('nested_set_folders');
            $folder->appendToNode($parent)->save();
            $this->nestedSetInsert($folder, $level + 1);
        }
    }

    protected function fetchNestedSetSubtree(): void
    {

        $folder = new BenchFolder;
        $folder->setTable('nested_set_folders');
        $node = $folder->newQuery()->latest('id')->first();
        $node->descendants()->get();
    }

    protected function generateMarkdown(array $results): string
    {
        $md = "# BenchFolder Nesting Benchmark Report\n\n";
        $md .= "| Strategy | Insert Time (s) | Fetch Time (s) | Notes |\n";
        $md .= "|----------|----------------:|----------------:|-------|\n";

        foreach ($results as $strategy => $data) {
            $md .= "| {$strategy} | "
                . number_format($data['insert_time'], 4) . ' | '
                . number_format($data['fetch_time'], 4) . ' | '
                . $data['notes'] . " |\n";
        }

        return $md;
    }
}
