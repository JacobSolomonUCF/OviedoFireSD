package comtelekpsi.github.oviedofireandroid;

import android.content.Context;
import android.graphics.Color;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by David on 9/9/2017.
 */

public class SubJSONParser {
    public static ArrayList<Button> subParse(String str, TableLayout mTableLayout, Context context){
        ArrayList<Button> buttons = new ArrayList();
        try {
            JSONObject object = (JSONObject) new JSONObject(str);
            JSONArray sections = object.getJSONArray("list");
            for (int i=0; i<sections.length(); i++){
                TableRow tableRow = new TableRow(context);
                mTableLayout.addView(tableRow);
                TextView textView = new TextView(context);
                JSONObject object2=sections.getJSONObject(i);
                String name=object2.getString("name");
                String cb=object2.getString("completedBy");
                if (!cb.equals("nobody")){
                    cb = "Completed by "+cb;
                    textView.setText(cb);}
                String formId=object2.getString("formId");
                Button button=new Button(context);
                buttons.add(button);
                button.setText(name);
                button.setBackgroundColor(Color.BLACK);
                button.setTextColor(Color.WHITE);
                button.setHint(formId);
                System.out.println(button.getHint());
                tableRow.addView(button);
                tableRow.addView(textView);
            }
        } catch (JSONException e) {
            // Appropriate error handling code
        }
        return buttons;
    }
}
