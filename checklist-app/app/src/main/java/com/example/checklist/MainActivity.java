package com.example.checklist;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Paint;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ListView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class MainActivity extends Activity {
    private static final String PREFS = "checklist";
    private static final String KEY_ITEMS = "items";

    private static class Task {
        final String text;
        boolean done;

        Task(String text, boolean done) {
            this.text = text;
            this.done = done;
        }
    }

    private final List<Task> tasks = new ArrayList<>();
    private TaskAdapter adapter;
    private EditText newItem;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        newItem = findViewById(R.id.newItem);
        ListView list = findViewById(R.id.list);
        adapter = new TaskAdapter();
        list.setAdapter(adapter);

        load();

        findViewById(R.id.addButton).setOnClickListener(v -> addItem());
        newItem.setOnEditorActionListener((v, actionId, event) -> {
            if (actionId == EditorInfo.IME_ACTION_DONE) {
                addItem();
                return true;
            }
            return false;
        });
        ((Button) findViewById(R.id.clearButton)).setOnClickListener(v -> {
            for (Iterator<Task> it = tasks.iterator(); it.hasNext(); ) {
                if (it.next().done) it.remove();
            }
            changed();
        });
    }

    private void addItem() {
        String text = newItem.getText().toString().trim();
        if (text.isEmpty()) return;
        tasks.add(new Task(text, false));
        newItem.setText("");
        changed();
    }

    private void changed() {
        adapter.notifyDataSetChanged();
        save();
    }

    private void save() {
        JSONArray arr = new JSONArray();
        try {
            for (Task t : tasks) {
                arr.put(new JSONObject().put("text", t.text).put("done", t.done));
            }
        } catch (JSONException e) {
            return;
        }
        getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .edit().putString(KEY_ITEMS, arr.toString()).apply();
    }

    private void load() {
        SharedPreferences prefs = getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        String json = prefs.getString(KEY_ITEMS, "[]");
        try {
            JSONArray arr = new JSONArray(json);
            for (int i = 0; i < arr.length(); i++) {
                JSONObject o = arr.getJSONObject(i);
                tasks.add(new Task(o.getString("text"), o.optBoolean("done")));
            }
        } catch (JSONException ignored) {
            tasks.clear();
        }
        adapter.notifyDataSetChanged();
    }

    private class TaskAdapter extends BaseAdapter {
        @Override
        public int getCount() {
            return tasks.size();
        }

        @Override
        public Task getItem(int position) {
            return tasks.get(position);
        }

        @Override
        public long getItemId(int position) {
            return position;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View row = convertView != null ? convertView
                    : LayoutInflater.from(MainActivity.this).inflate(R.layout.item_task, parent, false);
            Task task = getItem(position);
            CheckBox check = row.findViewById(R.id.check);
            // Detach the listener before setting state so recycled rows don't fire it.
            check.setOnCheckedChangeListener(null);
            check.setText(task.text);
            check.setChecked(task.done);
            applyStrike(check, task.done);
            check.setOnCheckedChangeListener((b, isChecked) -> {
                task.done = isChecked;
                applyStrike(check, isChecked);
                save();
            });
            row.findViewById(R.id.delete).setOnClickListener(v -> {
                tasks.remove(task);
                changed();
            });
            return row;
        }

        private void applyStrike(CheckBox box, boolean done) {
            if (done) {
                box.setPaintFlags(box.getPaintFlags() | Paint.STRIKE_THRU_TEXT_FLAG);
            } else {
                box.setPaintFlags(box.getPaintFlags() & ~Paint.STRIKE_THRU_TEXT_FLAG);
            }
        }
    }
}
